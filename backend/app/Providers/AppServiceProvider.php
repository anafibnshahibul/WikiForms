<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;
use App\Models\Form;
use App\Policies\FormPolicy;

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
        Gate::policy(Form::class, FormPolicy::class);

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
