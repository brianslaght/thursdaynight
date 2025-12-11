<?php

namespace App\Http\Controllers;

use App\Models\Series;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $series = Series::published()
            ->withCount('weeks')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('home', [
            'series' => $series,
        ]);
    }
}
