<?php

namespace App\Http\Controllers;

use App\Models\Series;
use Inertia\Inertia;
use Inertia\Response;

class SeriesController extends Controller
{
    public function show(Series $series): Response
    {
        $series->load('weeks');

        return Inertia::render('series/show', [
            'series' => $series,
            'weeks' => $series->weeks,
        ]);
    }
}
