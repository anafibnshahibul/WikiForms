<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('forms', function (Blueprint $table) {
            if (!Schema::hasColumn('forms', 'collaborators')) {
                $table->json('collaborators')->nullable()->after('owner_username');
            }
            if (!Schema::hasColumn('forms', 'content_type')) {
                $table->string('content_type')->default('form')->after('slug');
            }
        });
    }

    public function down(): void
    {
        Schema::table('forms', function (Blueprint $table) {
            $table->dropColumn(['collaborators', 'content_type']);
        });
    }
};
