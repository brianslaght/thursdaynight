<?php

namespace App\Http\Controllers;

use App\Events\PresentationStateUpdated;
use App\Models\PresentationState;
use App\Models\Series;
use App\Models\Week;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PresentationController extends Controller
{
    /**
     * Public presentation view - full screen for projector
     */
    public function present(Series $series, int $weekNumber): Response
    {
        $week = Week::where('series_id', $series->id)
            ->where('week_number', $weekNumber)
            ->firstOrFail();

        $state = PresentationState::firstOrCreate(
            ['week_id' => $week->id],
            [
                'section_index' => 0,
                'content_index' => 0,
                'expanded_scriptures' => [],
                'highlighted_question_index' => null,
                'is_active' => false,
            ]
        );

        // Filter out leader notes for presentation view
        $sections = $week->getSectionsForParticipant();

        return Inertia::render('presentation/present', [
            'series' => [
                'id' => $series->id,
                'title' => $series->title,
                'slug' => $series->slug,
            ],
            'week' => [
                'id' => $week->id,
                'week_number' => $week->week_number,
                'title' => $week->title,
                'question' => $week->question,
                'memory_verse' => $week->memory_verse,
                'memory_verse_ref' => $week->memory_verse_ref,
                'sections' => $sections,
            ],
            'initialState' => [
                'sectionIndex' => $state->section_index,
                'contentIndex' => $state->content_index,
                'expandedScriptures' => $state->expanded_scriptures,
                'highlightedQuestionIndex' => $state->highlighted_question_index,
                'isActive' => $state->is_active,
            ],
        ]);
    }

    /**
     * Leader control center - requires authentication
     */
    public function control(Series $series, int $weekNumber): Response
    {
        $this->authorizeLeader();

        $week = Week::where('series_id', $series->id)
            ->where('week_number', $weekNumber)
            ->firstOrFail();

        $state = PresentationState::firstOrCreate(
            ['week_id' => $week->id],
            [
                'section_index' => 0,
                'content_index' => 0,
                'expanded_scriptures' => [],
                'highlighted_question_index' => null,
                'is_active' => false,
                'leader_id' => Auth::id(),
            ]
        );

        // Leaders get full sections including leader notes
        $sections = $week->sections;

        return Inertia::render('presentation/control', [
            'series' => [
                'id' => $series->id,
                'title' => $series->title,
                'slug' => $series->slug,
            ],
            'week' => [
                'id' => $week->id,
                'week_number' => $week->week_number,
                'title' => $week->title,
                'question' => $week->question,
                'memory_verse' => $week->memory_verse,
                'memory_verse_ref' => $week->memory_verse_ref,
                'sections' => $sections,
            ],
            'initialState' => [
                'sectionIndex' => $state->section_index,
                'contentIndex' => $state->content_index,
                'expandedScriptures' => $state->expanded_scriptures,
                'highlightedQuestionIndex' => $state->highlighted_question_index,
                'isActive' => $state->is_active,
            ],
            'totalWeeks' => $series->weeks()->count(),
        ]);
    }

    /**
     * Update presentation state - called by leader controls
     */
    public function updateState(Request $request, Week $week): JsonResponse
    {
        $this->authorizeLeader();

        $validated = $request->validate([
            'section_index' => 'sometimes|integer|min:0',
            'content_index' => 'sometimes|integer|min:0',
            'expanded_scriptures' => 'sometimes|array',
            'highlighted_question_index' => 'sometimes|nullable|integer|min:0',
            'is_active' => 'sometimes|boolean',
        ]);

        $state = PresentationState::firstOrCreate(
            ['week_id' => $week->id],
            [
                'section_index' => 0,
                'content_index' => 0,
                'expanded_scriptures' => [],
                'highlighted_question_index' => null,
                'is_active' => false,
                'leader_id' => Auth::id(),
            ]
        );

        $state->update($validated);
        $state->leader_id = Auth::id();
        $state->save();

        // Broadcast to all viewers
        broadcast(new PresentationStateUpdated($state, 'update'))->toOthers();

        return response()->json([
            'success' => true,
            'state' => [
                'sectionIndex' => $state->section_index,
                'contentIndex' => $state->content_index,
                'expandedScriptures' => $state->expanded_scriptures,
                'highlightedQuestionIndex' => $state->highlighted_question_index,
                'isActive' => $state->is_active,
            ],
        ]);
    }

    /**
     * Navigate to next content item
     */
    public function next(Week $week): JsonResponse
    {
        $this->authorizeLeader();

        $state = PresentationState::where('week_id', $week->id)->firstOrFail();
        $sections = $week->getSectionsForParticipant();

        $currentSection = $sections[$state->section_index] ?? null;

        if (! $currentSection) {
            return response()->json(['success' => false, 'message' => 'Invalid section']);
        }

        // Clear any highlighted question when navigating
        $state->highlighted_question_index = null;

        // Try to move to next content item in current section
        if ($state->content_index < count($currentSection['content']) - 1) {
            $state->content_index++;
        }
        // Otherwise, move to next section
        elseif ($state->section_index < count($sections) - 1) {
            $state->section_index++;
            $state->content_index = 0;
        }
        // At the end - stay put

        $state->save();

        broadcast(new PresentationStateUpdated($state, 'next'))->toOthers();

        return response()->json([
            'success' => true,
            'state' => [
                'sectionIndex' => $state->section_index,
                'contentIndex' => $state->content_index,
                'expandedScriptures' => $state->expanded_scriptures,
                'highlightedQuestionIndex' => $state->highlighted_question_index,
            ],
        ]);
    }

    /**
     * Navigate to previous content item
     */
    public function previous(Week $week): JsonResponse
    {
        $this->authorizeLeader();

        $state = PresentationState::where('week_id', $week->id)->firstOrFail();
        $sections = $week->getSectionsForParticipant();

        // Clear any highlighted question when navigating
        $state->highlighted_question_index = null;

        // Try to move to previous content item in current section
        if ($state->content_index > 0) {
            $state->content_index--;
        }
        // Otherwise, move to previous section's last item
        elseif ($state->section_index > 0) {
            $state->section_index--;
            $previousSection = $sections[$state->section_index];
            $state->content_index = count($previousSection['content']) - 1;
        }
        // At the beginning - stay put

        $state->save();

        broadcast(new PresentationStateUpdated($state, 'previous'))->toOthers();

        return response()->json([
            'success' => true,
            'state' => [
                'sectionIndex' => $state->section_index,
                'contentIndex' => $state->content_index,
                'expandedScriptures' => $state->expanded_scriptures,
                'highlightedQuestionIndex' => $state->highlighted_question_index,
            ],
        ]);
    }

    /**
     * Toggle scripture expansion
     */
    public function toggleScripture(Request $request, Week $week): JsonResponse
    {
        $this->authorizeLeader();

        $validated = $request->validate([
            'section_index' => 'required|integer|min:0',
            'content_index' => 'required|integer|min:0',
        ]);

        $state = PresentationState::where('week_id', $week->id)->firstOrFail();

        $key = "{$validated['section_index']}-{$validated['content_index']}";
        $expanded = $state->expanded_scriptures ?? [];

        if (in_array($key, $expanded)) {
            $expanded = array_values(array_diff($expanded, [$key]));
        } else {
            $expanded[] = $key;
        }

        $state->expanded_scriptures = $expanded;
        $state->save();

        broadcast(new PresentationStateUpdated($state, 'toggleScripture'))->toOthers();

        return response()->json([
            'success' => true,
            'expandedScriptures' => $state->expanded_scriptures,
        ]);
    }

    /**
     * Highlight a specific question (zoom/focus mode)
     */
    public function highlightQuestion(Request $request, Week $week): JsonResponse
    {
        $this->authorizeLeader();

        $validated = $request->validate([
            'question_index' => 'nullable|integer|min:0',
        ]);

        $state = PresentationState::where('week_id', $week->id)->firstOrFail();
        $state->highlighted_question_index = $validated['question_index'];
        $state->save();

        broadcast(new PresentationStateUpdated($state, 'highlightQuestion'))->toOthers();

        return response()->json([
            'success' => true,
            'highlightedQuestionIndex' => $state->highlighted_question_index,
        ]);
    }

    private function authorizeLeader(): void
    {
        if (! Auth::check() || ! Auth::user()->isLeader()) {
            abort(403, 'Only leaders can access this feature');
        }
    }
}
