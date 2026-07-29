<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GradingController extends Controller
{
    // Upstream statuses worth retrying — transient provider issues, not client errors
    private const RETRYABLE_STATUSES = [429, 500, 502, 503, 504];

    /**
     * Called server-side from save-response.
     * Decrypted questions and raw answers array are passed in directly —
     * correctAnswer never leaves the server.
     * Returns ['earned' => int, 'total' => int, 'results' => [...]]
     */
    public function gradeItems(array $questions, array $answers): array
    {
        // Split questions: exact-match types vs open-ended (needs AI)
        $exactTypes = ['radio', 'select', 'true_false', 'checkbox'];
        $exactQuestions = [];
        $aiQuestions    = [];
        foreach ($questions as $q) {
            $type = $q['type'] ?? 'text';
            if (in_array($type, $exactTypes, true)) {
                $exactQuestions[] = $q;
            } else {
                $aiQuestions[] = $q;
            }
        }

        $byId = [];

        // Grade exact-match questions with string comparison (no API call)
        foreach ($exactQuestions as $q) {
            $id      = $q['id'] ?? null;
            $correct = trim(strtolower((string) ($q['correctAnswer'] ?? '')));
            $user    = $answers[$id] ?? '';
            // checkbox answers may be arrays
            if (is_array($user)) {
                $userNorm = array_map(fn($v) => trim(strtolower((string) $v)), $user);
                sort($userNorm);
                $correctArr = array_map(fn($v) => trim(strtolower((string) $v)), explode(',', $correct));
                sort($correctArr);
                $byId[$id] = $userNorm === $correctArr;
            } else {
                $byId[$id] = trim(strtolower((string) $user)) === $correct;
            }
        }

        // Grade open-ended questions via OpenRouter AI
        if (!empty($aiQuestions)) {
            $items = array_map(fn($q, $i) => [
                'id'            => $q['id'] ?? $i,
                'question'      => $q['text'] ?? $q['question'] ?? '',
                'correctAnswer' => $q['correctAnswer'] ?? '',
                'userAnswer'    => $answers[$q['id'] ?? $i] ?? '',
            ], $aiQuestions, array_keys($aiQuestions));

            $prompt = "Grade each answer as correct or incorrect, comparing meaning not exact wording. "
                . "An empty userAnswer is always incorrect. "
                . "Respond ONLY with a JSON object: {\"results\":[{\"id\":<id>,\"correct\":true|false}]}. "
                . "Items:\n" . json_encode(array_values($items));

            try {
                $response = \Illuminate\Support\Facades\Http::withToken(config('services.openrouter.key'))
                    ->timeout(15)
                    ->connectTimeout(5)
                    ->retry(2, fn($attempt) => $attempt * 500, function ($exception) {
                        if ($exception instanceof \Illuminate\Http\Client\ConnectionException) return true;
                        return $exception instanceof \Illuminate\Http\Client\RequestException
                            && in_array($exception->response->status(), self::RETRYABLE_STATUSES, true);
                    })
                    ->throw()
                    ->post('https://openrouter.ai/api/v1/chat/completions', [
                        'model'           => 'openrouter/free',
                        'messages'        => [['role' => 'user', 'content' => $prompt]],
                        'response_format' => ['type' => 'json_object'],
                    ]);

                $raw    = $response->json('choices.0.message.content');
                $parsed = json_decode($raw ?? '', true);
                $aiResults = is_array($parsed) ? ($parsed['results'] ?? $parsed) : [];
                foreach ($aiResults as $r) {
                    $byId[$r['id']] = (bool) ($r['correct'] ?? false);
                }
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::warning('gradeItems AI failed', ['error' => $e->getMessage()]);
                // AI failed — mark open-ended as incorrect rather than crashing
                foreach ($aiQuestions as $q) {
                    $byId[$q['id'] ?? ''] = false;
                }
            }
        }

        $earned = 0;
        $total  = 0;
        $detail = [];
        foreach ($questions as $q) {
            $id     = $q['id'] ?? null;
            $pts    = (int) ($q['points'] ?? 0);
            $ua     = trim((string) ($answers[$id] ?? ''));
            $correct = $ua !== '' && ($byId[$id] ?? false);
            $total  += $pts;
            if ($correct) $earned += $pts;
            $detail[] = ['id' => $id, 'correct' => $correct];
        }

        return ['earned' => $earned, 'total' => $total, 'results' => $detail];
    }

    public function gradeResponse(Request $request)
    {
        $v = $request->validate([
            'questions' => 'required|array',
        ]);

        $items = collect($v['questions'])->map(fn($q, $i) => [
            'id'            => $q['id'] ?? $i,
            'question'      => $q['question'] ?? '',
            'correctAnswer' => $q['correctAnswer'] ?? '',
            'userAnswer'    => $q['userAnswer'] ?? '',
        ])->values();

        $prompt = "Grade each answer as correct or incorrect, comparing meaning not exact wording. "
            . "An empty userAnswer is always incorrect. "
            . "Respond ONLY with a JSON object: {\"results\":[{\"id\":<id>,\"correct\":true|false}]}. "
            . "Items:\n" . json_encode($items);

        try {
            $response = Http::withToken(config('services.openrouter.key'))
                ->timeout(15)
                ->connectTimeout(5)
                ->retry(2, fn ($attempt) => $attempt * 500, function ($exception) {
                    if ($exception instanceof ConnectionException) {
                        return true;
                    }
                    return $exception instanceof RequestException
                        && in_array($exception->response->status(), self::RETRYABLE_STATUSES, true);
                })
                ->throw()
                ->post('https://openrouter.ai/api/v1/chat/completions', [
                    'model'           => 'openrouter/free',
                    'messages'        => [['role' => 'user', 'content' => $prompt]],
                    'response_format' => ['type' => 'json_object'],
                ]);

            $raw = $response->json('choices.0.message.content');
            $parsed = json_decode($raw ?? '', true);

            if (!is_array($parsed)) {
                Log::warning('OpenRouter returned an unparseable grading response', ['raw' => $raw]);
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Could not read the grading result. Please try again.',
                ], 502);
            }

            return response()->json(['status' => 'success', 'results' => $parsed['results'] ?? $parsed]);
        } catch (ConnectionException|RequestException $e) {
            Log::warning('OpenRouter grading request failed after retries', ['error' => $e->getMessage()]);
            return response()->json([
                'status'  => 'error',
                'message' => 'Grading service is temporarily unavailable. Please try again shortly.',
            ], 503);
        } catch (\Exception $e) {
            Log::error('Grading request failed unexpectedly', ['error' => $e->getMessage()]);
            return response()->json(['status' => 'error', 'message' => 'Grading failed'], 500);
        }
    }
}
