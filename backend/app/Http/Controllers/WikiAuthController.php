<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class WikiAuthController extends Controller
{
    public function redirectToMediaWiki()
    {
        $baseUrl = "https://meta.wikimedia.org/w/rest.php/oauth2/authorize";

        $queries = http_build_query([
            'client_id'     => config('services.mediawiki.client_id'),
            'response_type' => 'code',
            'redirect_uri'  => config('services.mediawiki.redirect'),
            'state'         => bin2hex(random_bytes(16)),
        ]);

        return redirect($baseUrl . '?' . $queries);
    }

    public function handleMediaWikiCallback(Request $request)
    {
        if ($request->has('error')) {
            $msg = json_encode($request->get('error_description', 'Authorization denied'));
            return $this->renderResult('WIKI_AUTH_ERROR', null, $msg);
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
            $email    = $userData['email'] ?? null;

            $user = User::where('name', $username)->first();

            if (!$user) {
                $user = User::create([
                    'name'     => $username,
                    'email'    => $email,
                    'password' => bcrypt(uniqid()),
                ]);
            }

            Auth::login($user, true);

            $userJson = json_encode(['username' => $username, 'email' => $email]);
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
