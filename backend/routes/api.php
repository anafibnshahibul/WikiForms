<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;

Route::middleware('throttle:20,1')->group(function () {

    Route::get('/test-connection', function () {
        return response()->json(['status' => 'success', 'message' => 'Connected!']);
    });

    // Save form - questions are encrypted before storage using Laravel's AES-256-CBC Crypt facade
    Route::post('/save-form', function (Request $request) {
        $v = $request->validate([
            'slug'             => 'required|string',
            'contentType'      => 'required|string',
            'title'            => 'required|string|max:255',
            'description'      => 'nullable|string',
            'cover_image'      => 'nullable|string',
            'questions'        => 'required|array',
            'owner_username'   => 'nullable|string',
            'timer_type'       => 'nullable|string',
            'timer_duration'   => 'nullable|integer',
            'timer_start'      => 'nullable|string',
            'timer_end'        => 'nullable|string',
            'timer_before_msg' => 'nullable|array',
            'timer_after_msg'  => 'nullable|array',
            'result_timing'    => 'nullable|string',
        ]);

        $encryptedQuestions = Crypt::encryptString(json_encode($v['questions']));

        DB::table('forms')->updateOrInsert(
            ['slug' => $v['slug']],
            [
                'content_type'     => $v['contentType'],
                'title'            => $v['title'],
                'description'      => $v['description'] ?? '',
                'cover_image'      => $v['cover_image'] ?? null,
                'questions'        => $encryptedQuestions,
                'owner_username'   => $v['owner_username'] ?? 'Anonymous',
                'timer_type'       => $v['timer_type'] ?? 'none',
                'timer_duration'   => $v['timer_duration'] ?? 0,
                'timer_start'      => $v['timer_start'] ?? null,
                'timer_end'        => $v['timer_end'] ?? null,
                'timer_before_msg' => json_encode($v['timer_before_msg'] ?? []),
                'timer_after_msg'  => json_encode($v['timer_after_msg'] ?? []),
                'result_timing'    => $v['result_timing'] ?? 'instant',
                'updated_at'       => now(),
                'created_at'       => now(),
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

        return response()->json(['status' => 'success', 'questions' => $questions]);
    });

    Route::post('/save-response', function (Request $request) {
        $v = $request->validate([
            'form_slug' => 'required|string',
            'title'     => 'required|string',
            'type'      => 'required|string',
            'answers'   => 'required|array',
        ]);
        DB::table('form_responses')->insert([
            'form_slug'  => $v['form_slug'],
            'title'      => $v['title'],
            'type'       => $v['type'],
            'answers'    => json_encode($v['answers']),
            'timestamp'  => now()->toDateTimeString(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        return response()->json(['status' => 'success']);
    });

    Route::get('/get-responses/{slug}', function ($slug) {
        $form = DB::table('forms')->where('slug', $slug)->first();
        if (!$form) return response()->json(['status' => 'error', 'message' => 'Form not found'], 404);
        $responses = DB::table('form_responses')
            ->where('form_slug', $slug)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($r) => [
                'id'        => $r->id,
                'answers'   => json_decode($r->answers, true),
                'timestamp' => $r->timestamp,
            ]);
        return response()->json(['status' => 'success', 'responses' => $responses]);
    });

    Route::post('/grade-response', [\App\Http\Controllers\GradingController::class, 'gradeResponse']);

});

// ============================================================
// i18n / Translation APIs
// ============================================================

// Returns all live translations for a given language.
// Falls back to English for any key missing in the requested language.
// Cached for 10 minutes to avoid repeated DB queries on every page load.
Route::get('/usr-lang/{lang}', function ($lang) {
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
Route::post('/editor', function (Request $request) {
    $v = $request->validate([
        'lang_code'       => 'required|string|max:10',
        'lang_name'       => 'required|string|max:100',
        'translation_key' => 'required|string|max:100',
        'value'           => 'required|string',
        'contributed_by'  => 'required|string|max:255',
    ]);

    $exists = DB::table('translations')
        ->where('lang_code', $v['lang_code'])
        ->where('translation_key', $v['translation_key'])
        ->first();

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
Route::post('/publisher', function (Request $request) {
    $v = $request->validate([
        'lang_code'       => 'required|string|max:10',
        'translation_key' => 'required|string|max:100',
        'published_by'    => 'required|string|max:255',
    ]);

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
