<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('forms', function (Blueprint $table) {
            if (!Schema::hasColumn('forms', 'timer_type')) {
                $table->string('timer_type')->default('none')->after('collaborators');
            }
            if (!Schema::hasColumn('forms', 'timer_duration')) {
                $table->integer('timer_duration')->default(0)->after('timer_type');
            }
            if (!Schema::hasColumn('forms', 'timer_start')) {
                $table->string('timer_start')->nullable()->after('timer_duration');
            }
            if (!Schema::hasColumn('forms', 'timer_end')) {
                $table->string('timer_end')->nullable()->after('timer_start');
            }
            if (!Schema::hasColumn('forms', 'timer_before_msg')) {
                $table->json('timer_before_msg')->nullable()->after('timer_end');
            }
            if (!Schema::hasColumn('forms', 'timer_after_msg')) {
                $table->json('timer_after_msg')->nullable()->after('timer_before_msg');
            }
        });
    }
    public function down(): void {
        Schema::table('forms', function (Blueprint $table) {
            $table->dropColumn(['timer_type','timer_duration','timer_start','timer_end','timer_before_msg','timer_after_msg']);
        });
    }
};
