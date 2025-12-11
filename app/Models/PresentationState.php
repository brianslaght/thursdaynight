<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PresentationState extends Model
{
    protected $fillable = [
        'week_id',
        'section_index',
        'content_index',
        'expanded_scriptures',
        'highlighted_question_index',
        'is_active',
        'leader_id',
    ];

    protected function casts(): array
    {
        return [
            'expanded_scriptures' => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function week(): BelongsTo
    {
        return $this->belongsTo(Week::class);
    }

    public function leader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'leader_id');
    }

    public function getCurrentContentItem(): ?array
    {
        $sections = $this->week->sections;

        if (!isset($sections[$this->section_index])) {
            return null;
        }

        $section = $sections[$this->section_index];

        if (!isset($section['content'][$this->content_index])) {
            return null;
        }

        return [
            'section' => $section,
            'sectionIndex' => $this->section_index,
            'item' => $section['content'][$this->content_index],
            'itemIndex' => $this->content_index,
        ];
    }

    public function isScriptureExpanded(int $sectionIndex, int $contentIndex): bool
    {
        $key = "{$sectionIndex}-{$contentIndex}";

        return in_array($key, $this->expanded_scriptures ?? []);
    }
}
