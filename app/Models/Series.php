<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Series extends Model
{
    protected $fillable = [
        'title',
        'subtitle',
        'badge_text',
        'description',
        'key_verse',
        'key_verse_ref',
        'slug',
        'icon',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
        ];
    }

    public function weeks(): HasMany
    {
        return $this->hasMany(Week::class)->orderBy('week_number');
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
