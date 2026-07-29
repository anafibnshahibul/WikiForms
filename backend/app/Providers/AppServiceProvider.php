<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Define the global API rate limiter
        RateLimiter::for('global-api', function (Request $request) {
            // Allows a maximum of 60 requests per minute per IP address
            return Limit::perMinute(60)->by($request->ip())->response(function (Request $request, array $headers) {
                return response()->json([
                    'status' => 429,
                    'error' => 'Too Many Requests',
                    'message' => 'You have sent too many requests in a short time. Please slow down and try again later.'
                ], 429, $headers);
            });
        });
    }
}
