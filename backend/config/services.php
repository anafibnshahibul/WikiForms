<?php

return [

    'openrouter' => [
        'key' => env('OPENROUTER_API_KEY', env('OPENROUTER_KEY')),
    ],

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mediawiki' => [
    // Both naming styles are accepted (.env.example uses MEDIAWIKI_*, production uses WIKI_*).
    'client_id' => env('WIKI_CLIENT_ID', env('MEDIAWIKI_CLIENT_ID')),
    'client_secret' => env('WIKI_CLIENT_SECRET', env('MEDIAWIKI_CLIENT_SECRET')),
    'redirect' => env('MEDIAWIKI_REDIRECT_URI', 'https://wikiforms.toolforge.org/api/auth/mediawiki/callback'),
    ],

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

];
