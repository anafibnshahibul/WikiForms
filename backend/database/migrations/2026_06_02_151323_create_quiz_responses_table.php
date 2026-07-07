<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('quiz_responses')) {
            Schema::create('quiz_responses', function (Blueprint $table) {
                $table->id();
                $table->string('quiz_id');
                $table->json('answers');
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('form_responses')) {
            Schema::create('form_responses', function (Blueprint $table) {
                $table->id();
                $table->string('form_slug');
                $table->string('title');
                $table->string('type');
                $table->json('answers');
                $table->string('timestamp');
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quiz_responses');
        Schema::dropIfExists('form_responses');
    }
};