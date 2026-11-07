<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The application code uses tables/columns that only existed in docker/mysql/init.sql
 * or were created by hand on Toolforge. This migration makes a fresh database match,
 * and is safe to run on the existing one (every step is guarded).
 */
return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('auth_tokens')) {
            Schema::create('auth_tokens', function (Blueprint $table) {
                $table->id();
                $table->string('token')->unique();   // sha256 of the token
                $table->string('username');
                $table->timestamp('expires_at');
                $table->timestamp('created_at')->nullable();
            });
        }

        if (!Schema::hasTable('quiz_sessions')) {
            Schema::create('quiz_sessions', function (Blueprint $table) {
                $table->string('id', 64)->primary();
                $table->string('form_slug');
                $table->string('username')->nullable();
                $table->timestamp('started_at')->nullable();
                $table->timestamp('last_beat')->nullable();
                $table->string('status', 20)->default('active');
                $table->timestamp('deadline')->nullable();
                $table->string('terminate_reason', 50)->nullable();
            });
        }

        if (!Schema::hasTable('translations')) {
            Schema::create('translations', function (Blueprint $table) {
                $table->id();
                $table->string('lang_code', 10);
                $table->string('lang_name', 100);
                $table->string('translation_key', 100);
                $table->text('value');
                $table->string('status', 20)->default('draft');
                $table->string('contributed_by')->nullable();
                $table->string('published_by')->nullable();
                $table->timestamps();
                $table->unique(['lang_code', 'translation_key'], 'translations_lang_key_unique');
            });
        }

        if (Schema::hasTable('forms')) {
            Schema::table('forms', function (Blueprint $table) {
                if (!Schema::hasColumn('forms', 'content_type'))     $table->string('content_type', 50)->default('form');
                if (!Schema::hasColumn('forms', 'cover_image'))      $table->text('cover_image')->nullable();
                if (!Schema::hasColumn('forms', 'result_timing'))    $table->string('result_timing', 20)->default('instant');
                if (!Schema::hasColumn('forms', 'timer_before_msg')) $table->longText('timer_before_msg')->nullable();
                if (!Schema::hasColumn('forms', 'timer_after_msg'))  $table->longText('timer_after_msg')->nullable();
            });
        }

        if (Schema::hasTable('form_responses')) {
            Schema::table('form_responses', function (Blueprint $table) {
                if (!Schema::hasColumn('form_responses', 'score'))    $table->longText('score')->nullable();
                if (!Schema::hasColumn('form_responses', 'username')) $table->string('username')->nullable();
            });
        }
    }

    public function down(): void
    {
        // Intentionally empty: these structures may pre-date this migration.
    }
};
