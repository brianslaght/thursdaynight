<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Week extends Model
{
    protected $fillable = [
        'series_id',
        'week_number',
        'title',
        'question',
        'icon',
        'memory_verse',
        'memory_verse_ref',
        'recap',
        'next_week_title',
        'next_week_homework',
        'sections',
    ];

    protected function casts(): array
    {
        return [
            'sections' => 'array',
        ];
    }

    public function series(): BelongsTo
    {
        return $this->belongsTo(Series::class);
    }

    public function getSectionsForParticipant(): array
    {
        $sections = $this->sections ?? [];

        return array_map(function ($section) {
            $section['content'] = array_filter($section['content'] ?? [], function ($item) {
                return $item['type'] !== 'leaderNote';
            });
            $section['content'] = array_values($section['content']);
            return $section;
        }, $sections);
    }
}
