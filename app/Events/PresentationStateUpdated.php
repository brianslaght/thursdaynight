<?php

namespace App\Events;

use App\Models\PresentationState;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PresentationStateUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public PresentationState $state,
        public string $action = 'update'
    ) {}

    public function broadcastOn(): array
    {
        return [
            new Channel('presentation.'.$this->state->week_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'state.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'action' => $this->action,
            'state' => [
                'sectionIndex' => $this->state->section_index,
                'contentIndex' => $this->state->content_index,
                'expandedScriptures' => $this->state->expanded_scriptures,
                'highlightedQuestionIndex' => $this->state->highlighted_question_index,
                'isActive' => $this->state->is_active,
            ],
        ];
    }
}
