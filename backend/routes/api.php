<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;

// Request gate (size, scanner agents, honeypot bans, origin check) lives in
// App\Http\Middleware\SecurityGate and is registered in bootstrap/app.php.

// Honeypot routes — scanners always probe these
Route::any('/wp-admin',      fn() => abort(404));
Route::any('/wp-login.php',  fn() => abort(404));
Route::any('/.env',          fn() => abort(404));
Route::any('/phpmyadmin',    fn() => abort(404));
Route::any('/setup.php',     fn() => abort(404));
Route::any('/xmlrpc.php',    fn() => abort(404));
Route::any('/admin',  function () {
    $key  = 'honeypot_' . md5(request()->ip());
    $hits = (int) cache()->get($key, 0) + 1;
    cache()->put($key, $hits, 3600);
    \Illuminate\Support\Facades\Log::warning('Honeypot hit', [
        'ip' => request()->ip(), 'ua' => request()->userAgent(), 'hits' => $hits
    ]);
    abort(404);
});




// Resolves and verifies the authenticated username.
// Accepts either a valid server session or a verified HMAC-signed token
// Resolves the authenticated username from session or DB-verified token.
function resolveUser(): string {
    $fromSession = session('wf_username', '');
    if ($fromSession) return $fromSession;
    $token = request()->header('X-WF-Token', '');
    if (!$token) return '';
    $row = DB::table('auth_tokens')
        ->where('token', hash('sha256', $token))
        ->where('expires_at', '>', now())
        ->first();
    return $row ? $row->username : '';
}
// ── Logout — invalidate token immediately ──────────────────────────
Route::post('/auth/logout', function (Request $request) {
    $token = $request->header('X-WF-Token', '');
    if ($token) {
        DB::table('auth_tokens')->where('token', hash('sha256', $token))->delete();
    }
    session()->flush();
    return response()->json(['status' => 'success', 'message' => 'Logged out.']);
});

// Session init and me — outside throttle group, no auth required
Route::middleware('throttle:10,1')->post('/auth/session-init', function (Request $request) {
    $token = $request->input('session_token', '');
    if (!$token) {
        return response()->json(['status' => 'error', 'message' => 'No token.'], 400);
    }
    $username = cache()->get('wf_auth_token_' . $token);
    if (!$username) {
        return response()->json(['status' => 'error', 'message' => 'Invalid or expired token.'], 403);
    }
    cache()->forget('wf_auth_token_' . $token);
    session(['wf_username' => $username]);
    return response()->json(['status' => 'success', 'username' => $username]);
});

Route::get('/auth/me', function () {
    $username = session('wf_username', null);
    if (!$username) {
        return response()->json(['status' => 'guest']);
    }
    return response()->json(['status' => 'success', 'username' => $username]);
});

Route::middleware('throttle:20,1')->group(function () {

    Route::get('/test-connection', function () {
        return response()->json(['status' => 'success', 'message' => 'Connected!']);
    });

    // Save form - questions are encrypted before storage using Laravel's AES-256-CBC Crypt facade
    Route::post('/save-form', function (Request $request) {
        $v = $request->validate([
            'slug'             => 'required|string|max:100|regex:/^[a-zA-Z0-9_-]+$/',
            'contentType'      => 'required|string|in:form,quiz',
            'title'            => 'required|string|max:255',
            'description'      => 'nullable|string|max:2000',
            'cover_image'      => 'nullable|url|max:500',
            'questions'        => 'required|array|max:200',
            'owner_username'   => 'nullable|string|max:255',
            'timer_type'       => 'nullable|string|in:none,static,scheduled',
            'timer_duration'   => 'nullable|integer|min:1|max:1440',
            'timer_start'      => 'nullable|string|max:30',
            'timer_end'        => 'nullable|string|max:30',
            'timer_before_msg' => 'nullable|array',
            'timer_after_msg'  => 'nullable|array',
            'result_timing'    => 'nullable|string|in:instant,delayed',
        ]);

        $sessionUser    = resolveUser();
        // Never trust a client-supplied owner: it would let anyone create forms "owned" by another user.
        $requestedOwner = $sessionUser ?: 'Anonymous';
        $existing       = DB::table('forms')->where('slug', $v['slug'])->first();

        if ($existing) {
            $collaborators = json_decode($existing->collaborators ?? '[]', true) ?? [];
            $isOwner       = $existing->owner_username === $sessionUser;
            $isCollab      = in_array($sessionUser, $collaborators);
            if (!$sessionUser || (!$isOwner && !$isCollab)) {
                return response()->json(['status' => 'error', 'message' => 'Forbidden: you do not own this form.'], 403);
            }
            $requestedOwner = $existing->owner_username;
        }

        $encryptedQuestions = Crypt::encryptString(json_encode($v['questions']));

        DB::table('forms')->updateOrInsert(
            ['slug' => $v['slug']],
            [
                'content_type'     => $v['contentType'],
                'title'            => $v['title'],
                'description'      => $v['description'] ?? '',
                'cover_image'      => $v['cover_image'] ?? null,
                'questions'        => $encryptedQuestions,
                'owner_username'   => $requestedOwner,
                'timer_type'       => $v['timer_type'] ?? 'none',
                'timer_duration'   => $v['timer_duration'] ?? 0,
                'timer_start'      => $v['timer_start'] ?? null,
                'timer_end'        => $v['timer_end'] ?? null,
                'timer_before_msg' => json_encode($v['timer_before_msg'] ?? []),
                'timer_after_msg'  => json_encode($v['timer_after_msg'] ?? []),
                'result_timing'    => $v['result_timing'] ?? 'instant',
                'updated_at'       => now(),
                'created_at'       => $existing->created_at ?? now(),
            ]
        );

        return response()->json(['status' => 'success']);
    });

    // Public metadata endpoint - questions are intentionally NOT returned here
    Route::get('/get-form/{slug}', function ($slug) {
        $form = DB::table('forms')->where('slug', $slug)->first();
        if (!$form) return response()->json(['status' => 'error', 'message' => 'Form not found!'], 404);

        return response()->json([
            'id'               => $form->slug,
            'contentType'      => $form->content_type ?? 'form',
            'title'            => $form->title,
            'description'      => $form->description,
            'cover_image'      => $form->cover_image,
            'owner_username'   => $form->owner_username,
            'collaborators'    => json_decode($form->collaborators ?? '[]'),
            'timer_type'       => $form->timer_type ?? 'none',
            'timer_duration'   => $form->timer_duration ?? 0,
            'timer_start'      => $form->timer_start,
            'timer_end'        => $form->timer_end,
            'timer_before_msg' => json_decode($form->timer_before_msg ?? '{}', true),
            'timer_after_msg'  => json_decode($form->timer_after_msg ?? '{}', true),
            'result_timing'    => $form->result_timing ?? 'instant',
        ]);
    });

    // Secured endpoint - called only when the user actually starts the form/quiz
    Route::post('/get-form-questions/{slug}', function ($slug) {
        $form = DB::table('forms')->where('slug', $slug)->first();
        if (!$form) return response()->json(['status' => 'error', 'message' => 'Form not found'], 404);

        try {
            $decrypted = Crypt::decryptString($form->questions);
            $questions = json_decode($decrypted, true);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Failed to decrypt form data'], 500);
        }

        $requester     = resolveUser();
        $collaborators = json_decode($form->collaborators ?? '[]', true) ?? [];
        $isOwner       = $form->owner_username === $requester;
        $isCollab      = in_array($requester, $collaborators);
        if (!$isOwner && !$isCollab) {
            $questions = array_map(function ($q) {
                unset($q['correctAnswer'], $q['successMsg'], $q['failMsg']);
                return $q;
            }, $questions ?? []);
        }
        return response()->json(['status' => 'success', 'questions' => $questions]);
    });

    // Delete form — owner only
    Route::delete('/delete-form/{slug}', function ($slug) {
        $requester = resolveUser();
        if (!$requester) return response()->json(['status' => 'error', 'message' => 'Login required.'], 403);
        $form = DB::table('forms')->where('slug', $slug)->first();
        if (!$form) return response()->json(['status' => 'error', 'message' => 'Form not found.'], 404);
        if ($form->owner_username !== $requester) return response()->json(['status' => 'error', 'message' => 'Forbidden.'], 403);
        DB::table('form_responses')->where('form_slug', $slug)->delete();
        DB::table('quiz_sessions')->where('form_slug', $slug)->delete();
        DB::table('forms')->where('slug', $slug)->delete();
        return response()->json(['status' => 'success']);
    });

    // Leaderboard — top 20 scored quiz submissions
    Route::get('/leaderboard/{slug}', function ($slug) {
        $form = DB::table('forms')->where('slug', $slug)->first();
        if (!$form) return response()->json(['status' => 'error', 'message' => 'Form not found.'], 404);
        $rows = DB::table('form_responses')
            ->where('form_slug', $slug)
            ->whereNotNull('score')
            ->orderByRaw("JSON_EXTRACT(score, '$.earned') DESC, JSON_EXTRACT(score, '$.total') DESC, created_at ASC")
            ->limit(20)
            ->get()
            ->map(function ($r) {
                $score = json_decode($r->score, true);
                return [
                    'username'  => $r->username ?? 'Anonymous',
                    'earned'    => $score['earned'] ?? 0,
                    'total'     => $score['total'] ?? 0,
                    'timestamp' => $r->timestamp,
                ];
            });
        return response()->json(['status' => 'success', 'leaderboard' => $rows]);
    });

    Route::middleware('throttle:10,1')->post('/save-response', function (Request $request) {
        $v = $request->validate([
            'form_slug' => 'required|string',
            'title'     => 'required|string',
            'type'      => 'required|string',
            'answers'   => 'required|array',
        ]);

        $score = null;
        if ($v['type'] === 'quiz') {
            $form = DB::table('forms')->where('slug', $v['form_slug'])->first();
            if ($form) {
                try {
                    $questions = json_decode(Crypt::decryptString($form->questions), true) ?? [];
                } catch (\Exception $e) {
                    $questions = [];
                }
                $gradable = array_filter($questions, fn($q) => !empty(trim($q['correctAnswer'] ?? '')));
                if (count($gradable) > 0) {
                    $score = app(\App\Http\Controllers\GradingController::class)
                                ->gradeItems(array_values($gradable), $v['answers']);
                }
            }
        }

        // Username MUST come from verified auth token — never trust client-supplied username
        $submitter = resolveUser() ?: null;
        // Only use client username as fallback for truly anonymous (no token) submissions
        if (!$submitter && !empty($v['username'])) {
            // Sanitize — strip any HTML/special chars, max 80 chars
            $submitter = substr(preg_replace('/[^a-zA-Z0-9_\- ]/', '', $v['username']), 0, 80) ?: null;
        }
        DB::table('form_responses')->insert([
            'form_slug'  => $v['form_slug'],
            'title'      => $v['title'],
            'type'       => $v['type'],
            'answers'    => json_encode($v['answers']),
            'score'      => $score !== null ? json_encode($score) : null,
            'username'   => $submitter,
            'timestamp'  => now()->toDateTimeString(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = ['status' => 'success'];
        if ($score !== null) {
            $response['score'] = $score;
            // Safe to reveal correct answers now — quiz is already submitted
            $revealed = [];
            foreach ($questions as $q) {
                $revealed[$q['id'] ?? ''] = [
                    'correctAnswer' => $q['correctAnswer'] ?? '',
                    'successMsg'    => $q['successMsg'] ?? '',
                    'failMsg'       => $q['failMsg'] ?? '',
                ];
            }
            $response['revealed'] = $revealed;
        }
        return response()->json($response);
    });

    Route::get('/get-responses/{slug}', function ($slug) {
        $form = DB::table('forms')->where('slug', $slug)->first();
        if (!$form) return response()->json(['status' => 'error', 'message' => 'Form not found'], 404);

        $requester     = resolveUser();
        $collaborators = json_decode($form->collaborators ?? '[]', true) ?? [];
        $isOwner       = $form->owner_username === $requester;
        $isCollab      = in_array($requester, $collaborators);
        if (!$requester || (!$isOwner && !$isCollab)) {
            return response()->json(['status' => 'error', 'message' => 'Forbidden: login required.'], 403);
        }

        // Decrypt questions to build an id→text lookup map
        $questionMap = [];
        try {
            $decrypted   = Crypt::decryptString($form->questions);
            $questions   = json_decode($decrypted, true) ?? [];
            foreach ($questions as $q) {
                if (!empty($q['id'])) {
                    // Strip HTML tags from question text for clean display
                    $questionMap[$q['id']] = strip_tags($q['text'] ?? $q['id']);
                }
            }
        } catch (\Exception $e) {}

        $responses = DB::table('form_responses')
            ->where('form_slug', $slug)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($r) use ($questionMap) {
                $raw     = json_decode($r->answers, true) ?? [];
                $labeled = [];
                foreach ($raw as $qId => $answer) {
                    // Use question text as key, fall back to original ID if not found
                    $raw_label = $questionMap[$qId] ?? $qId;
                    $label = html_entity_decode(strip_tags($raw_label), ENT_QUOTES | ENT_HTML5, 'UTF-8');
                    $labeled[$label] = $answer;
                }
                return [
                    'id'        => $r->id,
                    'answers'   => $labeled,
                    'timestamp' => $r->timestamp,
                ];
            });
        return response()->json(['status' => 'success', 'responses' => $responses]);
    });

    Route::middleware('throttle:5,1')->post('/grade-response', [\App\Http\Controllers\GradingController::class, 'gradeResponse']);
    // ============================================================
    // Heartbeat Anti-Cheat Module
    // ============================================================

    // Start a quiz session — returns a session token and server-side deadline.
    Route::middleware('throttle:10,1')->post('/quiz/start', function (Request $request) {
        $v = $request->validate([
            'form_slug' => 'required|string',
            'username'  => 'nullable|string',
        ]);

        $form = DB::table('forms')->where('slug', $v['form_slug'])->first();
        if (!$form) return response()->json(['status' => 'error', 'message' => 'Form not found.'], 404);

        // Only quizzes need heartbeat
        if ($form->content_type !== 'quiz') {
            return response()->json(['status' => 'skip']);
        }

        $sessionId = bin2hex(random_bytes(32));
        $duration  = ($form->timer_duration > 0) ? $form->timer_duration : 60;
        $deadline  = now()->addMinutes($duration);

        DB::table('quiz_sessions')->insert([
            'id'         => $sessionId,
            'form_slug'  => $v['form_slug'],
            'username'   => $v['username'] ?? 'anonymous',
            'started_at' => now(),
            'last_beat'  => now(),
            'status'     => 'active',
            'deadline'   => $deadline,
        ]);

        return response()->json([
            'status'     => 'success',
            'session_id' => $sessionId,
            'deadline'   => $deadline->toIso8601String(),
        ]);
    });

    // Heartbeat ping — client sends every 3 seconds while quiz is active.
    // Browser tab freeze causes JS to stop, missing beats flags the session.
    Route::withoutMiddleware('throttle:20,1')->middleware('throttle:40,1')->post('/quiz/heartbeat', function (Request $request) {
        $v = $request->validate([
            'session_id' => 'required|string|size:64',
        ]);

        $session = DB::table('quiz_sessions')
            ->where('id', $v['session_id'])
            ->where('status', 'active')
            ->first();

        if (!$session) {
            return response()->json(['status' => 'terminated', 'reason' => 'Session not found or already terminated.'], 403);
        }

        // Check if server-side deadline has passed
        if (now()->greaterThan($session->deadline)) {
            DB::table('quiz_sessions')
                ->where('id', $v['session_id'])
                ->update(['status' => 'terminated', 'terminate_reason' => 'deadline_exceeded']);
            return response()->json(['status' => 'terminated', 'reason' => 'Time is up.'], 403);
        }

        // Check if last beat was too long ago (> 5 seconds = tab was switched)
        $lastBeat  = \Carbon\Carbon::parse($session->last_beat);
        $gapSeconds = now()->diffInSeconds($lastBeat);

        if ($gapSeconds > 5) {
            DB::table('quiz_sessions')
                ->where('id', $v['session_id'])
                ->update(['status' => 'terminated', 'terminate_reason' => 'heartbeat_missed']);
            return response()->json(['status' => 'terminated', 'reason' => 'Tab switch detected.'], 403);
        }

        // Update last_beat timestamp
        DB::table('quiz_sessions')
            ->where('id', $v['session_id'])
            ->update(['last_beat' => now()]);

        return response()->json([
            'status'    => 'alive',
            'server_ts' => now()->toIso8601String(),
        ]);
    });

    // Validate session before accepting submission
    Route::middleware('throttle:10,1')->post('/quiz/validate-session', function (Request $request) {
        $v = $request->validate([
            'session_id' => ['required', 'string', 'size:64', 'regex:/^[a-f0-9]+$/'],
            'form_slug'  => 'required|string',
        ]);

        $session = DB::table('quiz_sessions')
            ->where('id', $v['session_id'])
            ->where('form_slug', $v['form_slug'])
            ->first();

        if (!$session) {
            return response()->json(['status' => 'error', 'message' => 'Invalid session.'], 403);
        }

        if ($session->status === 'terminated') {
            return response()->json(['status' => 'terminated', 'reason' => $session->terminate_reason], 403);
        }

        if (now()->greaterThan($session->deadline)) {
            return response()->json(['status' => 'terminated', 'reason' => 'deadline_exceeded'], 403);
        }

        // Mark as submitted
        DB::table('quiz_sessions')
            ->where('id', $v['session_id'])
            ->update(['status' => 'submitted']);

        return response()->json(['status' => 'valid']);
    });






    // Returns all forms owned by or collaborated on by a given Wikipedia user,
    // along with response counts — used by the My Forms dashboard.
    Route::get('/my-forms/{username}', function ($username) {
        $requester = resolveUser();
        if (!$requester) {
            return response()->json(['status' => 'error', 'message' => 'Login required.'], 403);
        }
        // Laravel has already URL-decoded the route parameter; decoding again would
        // corrupt names containing '+' or '%'.
        if ($requester !== $username) {
            return response()->json(['status' => 'error', 'message' => 'Forbidden.'], 403);
        }

        // Filter in SQL and select only the light columns. The old version loaded every
        // form row (including the large encrypted `questions` column) into PHP memory and
        // ran two extra queries per form, which is what exhausts memory/time on Toolforge.
        $forms = DB::table('forms')
            ->select('slug', 'title', 'content_type', 'owner_username', 'collaborators',
                     'timer_type', 'created_at', 'updated_at')
            ->where(function ($q) use ($requester) {
                $q->where('owner_username', $requester)
                  ->orWhere('collaborators', 'like', '%' . json_encode($requester, JSON_UNESCAPED_UNICODE) . '%')
                  ->orWhere('collaborators', 'like', '%' . json_encode($requester) . '%');
            })
            ->orderByDesc('updated_at')
            ->get()
            // LIKE is only a pre-filter; confirm exact membership in PHP.
            ->filter(function ($form) use ($requester) {
                if ($form->owner_username === $requester) return true;
                $collabs = json_decode($form->collaborators ?? '[]', true);
                return is_array($collabs) && in_array($requester, $collabs, true);
            })
            ->values();

        $slugs = $forms->pluck('slug')->all();
        $counts = $slugs
            ? DB::table('form_responses')->whereIn('form_slug', $slugs)
                ->select('form_slug', DB::raw('COUNT(*) as c'))->groupBy('form_slug')
                ->pluck('c', 'form_slug')
            : collect();

        // Last 30 response dates per form, fetched once (not once per form).
        $recent = [];
        if ($slugs) {
            DB::table('form_responses')
                ->whereIn('form_slug', $slugs)
                ->orderByDesc('created_at')
                ->limit(30 * count($slugs))
                ->get(['form_slug', 'created_at'])
                ->each(function ($r) use (&$recent) {
                    if (count($recent[$r->form_slug] ?? []) < 30) {
                        $recent[$r->form_slug][] = $r->created_at;
                    }
                });
        }

        $result = $forms->map(fn($form) => [
            'slug'           => $form->slug,
            'title'          => $form->title,
            'content_type'   => $form->content_type,
            'owner_username' => $form->owner_username,
            'collaborators'  => json_decode($form->collaborators ?? '[]'),
            'timer_type'     => $form->timer_type ?? 'none',
            'response_count' => (int) ($counts[$form->slug] ?? 0),
            'recent_dates'   => $recent[$form->slug] ?? [],
            'created_at'     => $form->created_at,
            'updated_at'     => $form->updated_at,
        ])->values();

        return response()->json(['status' => 'success', 'forms' => $result]);
    });


});

// ============================================================
// i18n / Translation APIs
// ============================================================

// Returns all live translations for a given language.
// Falls back to English for any key missing in the requested language.
// Cached for 10 minutes to avoid repeated DB queries on every page load.
Route::middleware('throttle:60,1')->get('/usr-lang/{lang}', function ($lang) {
    if (!preg_match('/^[a-z]{2,3}(-[A-Za-z0-9]{2,8})?$/', $lang)) {
        return response()->json(['status' => 'error', 'message' => 'Invalid language code.'], 400);
    }
    $cacheKey = 'translations_' . $lang;
    $keys = Cache::remember($cacheKey, 600, function () use ($lang) {
        $live = DB::table('translations')
            ->where('lang_code', $lang)
            ->where('status', 'live')
            ->pluck('value', 'translation_key');
        if ($lang !== 'en') {
            $english = DB::table('translations')
                ->where('lang_code', 'en')
                ->where('status', 'live')
                ->pluck('value', 'translation_key');
            $live = $english->merge($live);
        }
        return $live;
    });

    return response()->json([
        'status' => 'success',
        'lang'   => $lang,
        'keys'   => $keys,
    ])->header('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600');
});

// Returns list of available languages with their live key coverage.
Route::get('/usr-lang', function () {
    $langs = DB::table('translations')
        ->select('lang_code', 'lang_name',
            DB::raw("SUM(status = 'live') as live_count"),
            DB::raw('COUNT(*) as total_count'))
        ->groupBy('lang_code', 'lang_name')
        ->orderBy('lang_code')
        ->get()
        ->map(fn($r) => [
            'code'       => $r->lang_code,
            'name'       => $r->lang_name,
            'live_count' => (int) $r->live_count,
            'total'      => (int) $r->total_count,
            'coverage'   => $r->total_count > 0
                ? round(($r->live_count / $r->total_count) * 100)
                : 0,
        ]);

    return response()->json(['status' => 'success', 'languages' => $langs]);
});

// Logged-in Wikipedia user submits a translation for a key (creates or updates as draft).
Route::middleware('throttle:30,1')->post('/editor', function (Request $request) {
    $sessionUser = resolveUser();
    if (!$sessionUser) {
        return response()->json(['status' => 'error', 'message' => 'Login required.'], 403);
    }
    $v = $request->validate([
        'lang_code'       => ['required', 'string', 'max:10', 'regex:/^[a-z]{2,3}(-[A-Za-z0-9]{2,8})?$/'],
        'lang_name'       => 'required|string|max:100',
        'translation_key' => 'required|string|max:100',
        'value'           => 'required|string|max:2000',
    ]);
    $v['contributed_by'] = $sessionUser;

    $exists = DB::table('translations')
        ->where('lang_code', $v['lang_code'])
        ->where('translation_key', $v['translation_key'])
        ->first();

    // A live translation can only be changed by the person who contributed it.
    // Without this, anyone could overwrite someone else's translation (it became their
    // draft) and then publish it themselves.
    if ($exists && $exists->status === 'live' && $exists->contributed_by !== $sessionUser) {
        return response()->json(['status' => 'error', 'message' => 'This translation is live and owned by another contributor.'], 403);
    }

    // Never allow editing system-seeded English live keys directly
    if ($exists && $v['lang_code'] === 'en' && $exists->contributed_by === 'system' && $exists->status === 'live') {
        return response()->json(['status' => 'error', 'message' => 'English source keys are read-only.'], 403);
    }

    DB::table('translations')->updateOrInsert(
        ['lang_code' => $v['lang_code'], 'translation_key' => $v['translation_key']],
        [
            'lang_name'      => $v['lang_name'],
            'value'          => $v['value'],
            'status'         => 'draft',
            'contributed_by' => $v['contributed_by'],
            'published_by'   => null,
            'updated_at'     => now(),
            'created_at'     => now(),
        ]
    );

    return response()->json(['status' => 'success', 'message' => 'Translation saved as draft.']);
});

// Any logged-in Wikipedia user can publish a draft translation.
Route::middleware('throttle:30,1')->post('/publisher', function (Request $request) {
    $sessionUser = resolveUser();
    if (!$sessionUser) {
        return response()->json(['status' => 'error', 'message' => 'Login required.'], 403);
    }
    $v = $request->validate([
        'lang_code'       => 'required|string|max:10',
        'translation_key' => 'required|string|max:100',
    ]);
    $v['published_by'] = $sessionUser;

    $row = DB::table('translations')
        ->where('lang_code', $v['lang_code'])
        ->where('translation_key', $v['translation_key'])
        ->first();

    if (!$row) {
        return response()->json(['status' => 'error', 'message' => 'Translation not found.'], 404);
    }

    if ($v['lang_code'] === 'en' && $row->contributed_by === 'system') {
        return response()->json(['status' => 'error', 'message' => 'English source keys cannot be republished.'], 403);
    }

    // Only the contributor can publish their own draft
    if ($row->contributed_by !== $sessionUser) {
        return response()->json(['status' => 'error', 'message' => 'Forbidden: you can only publish your own translations.'], 403);
    }

    DB::table('translations')
        ->where('lang_code', $v['lang_code'])
        ->where('translation_key', $v['translation_key'])
        ->update([
            'status'       => 'live',
            'published_by' => $v['published_by'],
            'updated_at'   => now(),
        ]);

    return response()->json(['status' => 'success', 'message' => 'Translation published.']);
});

// Returns all draft translations for a language (for the Contribute page).
Route::get('/editor/{lang}', function ($lang) {
    $drafts = DB::table('translations')
        ->where('lang_code', $lang)
        ->orderBy('translation_key')
        ->get()
        ->map(fn($r) => [
            'key'            => $r->translation_key,
            'value'          => $r->value,
            'status'         => $r->status,
            'contributed_by' => $r->contributed_by,
            'updated_at'     => $r->updated_at,
        ]);

    $english = DB::table('translations')
        ->where('lang_code', 'en')
        ->where('status', 'live')
        ->pluck('value', 'translation_key');

    return response()->json([
        'status'  => 'success',
        'lang'    => $lang,
        'source'  => $english,
        'drafts'  => $drafts,
    ]);
});
