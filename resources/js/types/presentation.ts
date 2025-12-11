export interface PresentationState {
    sectionIndex: number;
    contentIndex: number;
    expandedScriptures: string[];
    highlightedQuestionIndex: number | null;
    isActive: boolean;
}

export interface ContentItem {
    type: 'body' | 'scripture' | 'prompts' | 'leaderNote' | 'callout';
    text?: string;
    ref?: string;
    questions?: string[];
    title?: string;
    content?: string;
}

export interface Section {
    title: string;
    icon: string;
    content: ContentItem[];
}

export interface PresentationWeek {
    id: number;
    week_number: number;
    title: string;
    question: string;
    memory_verse: string | null;
    memory_verse_ref: string | null;
    sections: Section[];
}

export interface PresentationSeries {
    id: number;
    title: string;
    slug: string;
}

export interface PresentationEvent {
    action: string;
    state: PresentationState;
}
