<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class WikiAuthController extends Controller
{
    public function redirectToMediaWiki()
    {
        $baseUrl = "https://meta.wikimedia.org/w/rest.php/oauth2/authorize";

        // Remember the state in the session so the callback can verify it (CSRF protection).
        $state = bin2hex(random_bytes(16));
        session(['wf_oauth_state' => $state]);

        $queries = http_build_query([
            'client_id'     => config('services.mediawiki.client_id'),
            'response_type' => 'code',
            'redirect_uri'  => config('services.mediawiki.redirect'),
            'state'         => $state,
        ]);

        return redirect($baseUrl . '?' . $queries);
    }

    public function handleMediaWikiCallback(Request $request)
    {
        if ($request->has('error')) {
            $msg = json_encode('Authorization denied', JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
            return $this->renderResult('WIKI_AUTH_ERROR', null, $msg);
        }

        $expectedState = session()->pull('wf_oauth_state');
        $givenState    = (string) $request->get('state', '');
        if (!$expectedState || !hash_equals($expectedState, $givenState)) {
            return $this->renderResult('WIKI_AUTH_ERROR', null, json_encode('Login failed (invalid state). Please try again.'));
        }

        try {
            $response = Http::asForm()
                ->withBasicAuth(config('services.mediawiki.client_id'), config('services.mediawiki.client_secret'))
                ->post('https://meta.wikimedia.org/w/rest.php/oauth2/access_token', [
                    'grant_type'   => 'authorization_code',
                    'code'         => $request->get('code'),
                    'redirect_uri' => config('services.mediawiki.redirect'),
                ]);

            if ($response->failed()) {
                throw new \Exception('Token exchange failed');
            }

            $tokenData   = $response->json();
            $accessToken = $tokenData['access_token'] ?? null;

            $userResponse = Http::withToken($accessToken)
                ->get('https://meta.wikimedia.org/w/rest.php/oauth2/resource/profile');

            if ($userResponse->failed()) {
                throw new \Exception('Failed to fetch user info from Wikimedia.');
            }

            $userData = $userResponse->json();
            $username = $userData['username'] ?? 'Unknown User';
            // Deliberately NOT reading the user's email: the privacy policy promises WikiForms
            // stores no email addresses. The users table requires a unique, non-null email,
            // so a non-routable placeholder derived from the username is stored instead.

            $user = User::where('name', $username)->first();

            if (!$user) {
                $user = User::create([
                    'name'     => $username,
                    'email'    => substr(hash('sha256', $username), 0, 32) . '@users.wikiforms.invalid',
                    'password' => bcrypt(bin2hex(random_bytes(16))),
                ]);
            }

            Auth::login($user, true);

            // Store username in session for server-side auth on protected API routes
            session(['wf_username' => $username]);

            // Generate HMAC-signed token so the frontend can prove identity
            // without relying on session cookies across popup/main-window boundary.
            // Format: username|timestamp|hmac(username|timestamp, APP_KEY)
            // Generate a simple random token and store it in DB with 30-day expiry.
            // DB verification is more reliable than HMAC across key rotations.
            $authToken = bin2hex(random_bytes(32));
            DB::table('auth_tokens')->insert([
                'token'      => hash('sha256', $authToken),
                'username'   => $username,
                'expires_at' => now()->addDays(30),
                'created_at' => now(),
            ]);
            // Clean up expired tokens
            DB::table('auth_tokens')->where('expires_at', '<', now())->delete();

            // Also generate a one-time session-init token
            $sessionToken = bin2hex(random_bytes(24));
            cache()->put('wf_auth_token_' . $sessionToken, $username, now()->addMinutes(2));

            $userJson = json_encode(flags: JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT, value: [
                'username'      => $username,
                'auth_token'    => $authToken,
                'session_token' => $sessionToken,
            ]);
            return $this->renderResult('WIKI_AUTH_SUCCESS', $userJson, null);

        } catch (\Exception $e) {
            $msg = json_encode('Login failed. Please try again.');
            return $this->renderResult('WIKI_AUTH_ERROR', null, $msg);
        }
    }

    /**
     * Renders a minimal HTML page that communicates the auth result back to the
     * opener tab via both postMessage and a localStorage 'storage' event, since
     * window.opener can be unreliable across the OAuth redirect chain in some
     * browsers. The storage event is the primary, more reliable channel.
     */
    private function renderResult(string $type, ?string $userJson, ?string $errorMsg)
    {
        $payload = $type === 'WIKI_AUTH_SUCCESS'
            ? "{ type: '{$type}', user: {$userJson}, ts: Date.now() }"
            : "{ type: '{$type}', message: {$errorMsg}, ts: Date.now() }";

        $statusText = $type === 'WIKI_AUTH_SUCCESS'
            ? 'Login successful. You can close this window.'
            : 'Login failed. You can close this window.';

        $html = <<<HTML
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>WikiForms Login</title></head>
<body style="font-family:sans-serif;text-align:center;margin-top:60px;color:#202122;">
  <p>{$statusText}</p>
  <script>
    (function() {
      var payload = {$payload};
      try { localStorage.setItem('wikiforms_auth_event', JSON.stringify(payload)); } catch (e) {}
      try {
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(payload, window.location.origin);
        }
      } catch (e) {}
      setTimeout(function() {
        try { window.close(); } catch (e) {}
      }, 400);
    })();
  </script>
</body>
</html>
HTML;

        return response($html)->header('Content-Type', 'text/html');
    }
}
