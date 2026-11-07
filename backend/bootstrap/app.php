<?php
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->trustProxies(at: '*');
        $middleware->trustProxies(at: '*');
        // Enable session on API routes so session('wf_username') works for auth checks.
        $middleware->api(prepend: [
            Illuminate\Session\Middleware\StartSession::class,
            \App\Http\Middleware\SecurityHeaders::class,
        ]);
        // All API routes use session-cookie auth rather than CSRF tokens.
        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
    })->create();
