<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

/**
 * Pre-routing checks for every API request.
 *
 * These used to run as top-level code in routes/api.php, where a bare `return`
 * only stops that file from loading (the client got a 404 and the remaining
 * routes were skipped) instead of sending the intended 403/413/429 response.
 */
class SecurityGate
{
    private const ALLOWED_ORIGIN = 'https://wikiforms.toolforge.org';

    private const BLOCKED_AGENTS = [
        'sqlmap', 'nikto', 'nmap', 'masscan', 'zgrab', 'dirbuster', 'gobuster',
        'nuclei', 'burpsuite', 'hydra',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        // 1. Oversized requests (max 1 MB).
        if ((int) $request->header('Content-Length', 0) > 1_048_576) {
            return $this->deny('Request too large.', 413);
        }

        $ip = md5((string) $request->ip());

        // 2. Known scanner user agents.
        $ua = strtolower((string) $request->header('User-Agent', ''));
        foreach (self::BLOCKED_AGENTS as $bot) {
            if (str_contains($ua, $bot)) {
                $this->trackSuspicious($ip);
                return $this->deny('Forbidden.', 403);
            }
        }

        // 3. IPs that probed honeypot endpoints 3+ times.
        if ((int) cache()->get('honeypot_' . $ip, 0) >= 3) {
            return $this->deny('Forbidden.', 403);
        }

        // 4. IPs with too many suspicious requests (>50/hour).
        $suspicious = (int) cache()->get('wf_suspicious_' . $ip, 0);
        if ($suspicious > 50) {
            Log::warning('Suspicious IP auto-blocked', ['ip' => $request->ip(), 'count' => $suspicious]);
            return $this->deny('Too many suspicious requests.', 429);
        }

        // 5. Cross-origin browser requests (error code 677). Exact origin match:
        //    a prefix check would also accept https://wikiforms.toolforge.org.evil.example
        foreach (['Origin', 'Referer'] as $header) {
            $value = (string) $request->header($header, '');
            if ($value !== '' && !$this->originAllowed($value)) {
                return response()->json([
                    'status'  => 'error',
                    'code'    => 677,
                    'message' => 'Request blocked: unauthorized origin.',
                ], 403);
            }
        }

        // 6. Occasional housekeeping (1% of requests).
        if (random_int(1, 100) === 1) {
            DB::table('auth_tokens')->where('expires_at', '<', now()->subDays(1))->delete();
            DB::table('quiz_sessions')->where('started_at', '<', now()->subDays(7))->delete();
        }

        return $next($request);
    }

    private function originAllowed(string $value): bool
    {
        $parts = parse_url($value);
        if (!$parts || empty($parts['scheme']) || empty($parts['host'])) {
            return false;
        }
        $origin = strtolower($parts['scheme'] . '://' . $parts['host'] . (isset($parts['port']) ? ':' . $parts['port'] : ''));

        if ($origin === self::ALLOWED_ORIGIN) {
            return true;
        }

        // Local development only (docker-compose / vite dev server).
        return !app()->isProduction()
            && in_array($parts['host'], ['localhost', '127.0.0.1'], true);
    }

    private function trackSuspicious(string $ipHash): void
    {
        $key = 'wf_suspicious_' . $ipHash;
        cache()->put($key, (int) cache()->get($key, 0) + 1, 3600);
    }

    private function deny(string $message, int $status): Response
    {
        return response()->json(['status' => 'error', 'message' => $message], $status);
    }
}
