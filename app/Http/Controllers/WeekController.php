<?php

namespace App\Http\Controllers;

use App\Models\Series;
use App\Models\Week;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class WeekController extends Controller
{
    public function show(Series $series, int $weekNumber): Response
    {
        $week = Week::where('series_id', $series->id)
            ->where('week_number', $weekNumber)
            ->firstOrFail();

        $isLeader = Auth::check() && Auth::user()->isLeader();

        // Filter out leader notes for non-leaders
        $sections = $isLeader ? $week->sections : $week->getSectionsForParticipant();

        $totalWeeks = $series->weeks()->count();

        return Inertia::render('series/week', [
            'series' => $series,
            'week' => [
                'id' => $week->id,
                'week_number' => $week->week_number,
                'title' => $week->title,
                'question' => $week->question,
                'icon' => $week->icon,
                'recap' => $week->recap,
                'next_week_title' => $week->next_week_title,
                'next_week_homework' => $week->next_week_homework,
                'sections' => $sections,
            ],
            'isLeader' => $isLeader,
            'totalWeeks' => $totalWeeks,
        ]);
    }
}
