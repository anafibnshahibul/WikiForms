<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Form extends Model
{
    protected $table = 'forms';

    protected $fillable = [
        'slug', 'content_type', 'title', 'description', 'cover_image',
        'questions', 'owner_username', 'collaborators',
        'timer_type', 'timer_duration', 'timer_start', 'timer_end',
        'timer_before_msg', 'timer_after_msg', 'result_timing',
    ];

    protected $casts = [
        'timer_before_msg' => 'array',
        'timer_after_msg'  => 'array',
    ];

    /**
     * Collaborators are stored as a raw JSON string column (not cast),
     * since some routes write it via DB::table()->update() directly.
     * This accessor decodes it safely regardless of how it was written.
     */
    public function getCollaboratorsListAttribute(): array
    {
        return json_decode($this->collaborators ?? '[]', true) ?? [];
    }
}
