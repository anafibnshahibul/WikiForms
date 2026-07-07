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
