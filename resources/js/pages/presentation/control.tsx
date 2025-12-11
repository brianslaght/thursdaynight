import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';
import { usePresentation } from '@/hooks/use-presentation';
import type { PresentationState, PresentationSeries, PresentationWeek, ContentItem } from '@/types/presentation';

interface Props {
    series: PresentationSeries;
    week: PresentationWeek;
    initialState: PresentationState;
    totalWeeks: number;
}

function ContentItemPreview({
    item,
    sectionIndex,
    contentIndex,
    isActive,
    isScriptureExpanded,
    onSelect,
    onToggleScripture,
    onHighlightQuestion,
    highlightedQuestionIndex,
}: {
    item: ContentItem;
    sectionIndex: number;
    contentIndex: number;
    isActive: boolean;
    isScriptureExpanded: boolean;
    onSelect: () => void;
    onToggleScripture: () => void;
    onHighlightQuestion: (index: number | null) => void;
    highlightedQuestionIndex: number | null;
}) {
    const baseClasses = `p-4 rounded-lg border-2 transition-all cursor-pointer ${
        isActive
            ? 'border-[#a78bfa] bg-[#a78bfa]/10'
            : 'border-transparent bg-[#1e1e32] hover:border-[#3e3e5a]'
    }`;

    switch (item.type) {
        case 'body':
            return (
                <div className={baseClasses} onClick={onSelect}>
                    <span className="text-xs text-[#9494a8] uppercase tracking-wide">Body</span>
                    <p className="text-sm text-[#c4c4d4] mt-1 line-clamp-2">{item.text}</p>
                </div>
            );

        case 'scripture':
            return (
                <div className={baseClasses}>
                    <div className="flex items-center justify-between" onClick={onSelect}>
                        <div>
                            <span className="text-xs text-[#9494a8] uppercase tracking-wide">Scripture</span>
                            <p className="text-sm font-semibold text-[#a78bfa] mt-1">{item.ref}</p>
                        </div>
                    </div>
                    {isActive && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleScripture();
                            }}
                            className={`mt-3 w-full py-2 rounded text-sm font-semibold transition-all ${
                                isScriptureExpanded
                                    ? 'bg-[#4ade80] text-[#121220]'
                                    : 'bg-[#a78bfa] text-white'
                            }`}
                        >
                            {isScriptureExpanded ? 'Hide Verse' : 'Reveal Verse'}
                        </button>
                    )}
                </div>
            );

        case 'prompts':
            return (
                <div className={baseClasses}>
                    <div onClick={onSelect}>
                        <span className="text-xs text-[#9494a8] uppercase tracking-wide">Discussion Questions</span>
                        <p className="text-sm text-[#fb923c] mt-1">{item.questions?.length || 0} questions</p>
                    </div>
                    {isActive && item.questions && (
                        <div className="mt-3 space-y-2">
                            {item.questions.map((q, qIdx) => (
                                <button
                                    key={qIdx}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onHighlightQuestion(
                                            highlightedQuestionIndex === qIdx ? null : qIdx
                                        );
                                    }}
                                    className={`w-full text-left p-2 rounded text-xs transition-all ${
                                        highlightedQuestionIndex === qIdx
                                            ? 'bg-[#fb923c] text-[#121220]'
                                            : 'bg-[#0a0a14] text-[#c4c4d4] hover:bg-[#1e1e32]'
                                    }`}
                                >
                                    <span className="font-bold mr-2">{qIdx + 1}.</span>
                                    <span className="line-clamp-1">{q}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            );

        case 'leaderNote':
            return (
                <div className={`${baseClasses} border-dashed border-[#fbbf24]/40`} onClick={onSelect}>
                    <span className="text-xs text-[#fbbf24] uppercase tracking-wide">Leader Note</span>
                    <p className="text-sm text-[#c4c4d4] mt-1 italic line-clamp-2">{item.text}</p>
                    <span className="text-xs text-[#9494a8] mt-2 block">Not shown on projection</span>
                </div>
            );

        case 'callout':
            return (
                <div className={baseClasses} onClick={onSelect}>
                    <span className="text-xs text-[#9494a8] uppercase tracking-wide">Callout</span>
                    <p className="text-sm font-semibold text-[#60a5fa] mt-1">{item.title}</p>
                </div>
            );

        default:
            return null;
    }
}

export default function ControlCenter({ series, week, initialState, totalWeeks }: Props) {
    const {
        state,
        isConnected,
        navigate,
        goToItem,
        toggleScripture,
        highlightQuestion,
    } = usePresentation({
        weekId: week.id,
        initialState,
        isController: true,
    });

    // Calculate flat index for keyboard navigation (excluding leader notes for counting)
    const flattenedItems: { sectionIndex: number; contentIndex: number; item: ContentItem }[] = [];
    week.sections.forEach((section, sIdx) => {
        section.content.forEach((item, cIdx) => {
            // Include all items in the control center list
            flattenedItems.push({ sectionIndex: sIdx, contentIndex: cIdx, item });
        });
    });

    const currentFlatIndex = flattenedItems.findIndex(
        f => f.sectionIndex === state.sectionIndex && f.contentIndex === state.contentIndex
    );

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                navigate('next');
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                navigate('previous');
            } else if (e.key === 'Escape') {
                highlightQuestion(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navigate, highlightQuestion]);

    return (
        <>
            <Head title={`Control: ${week.title}`} />
            <div className="min-h-screen bg-[#0a0a14] text-[#f8f8ff]">
                {/* Header */}
                <header className="sticky top-0 z-50 bg-[#121220] border-b border-white/10 px-6 py-4">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div>
                            <Link
                                href={`/series/${series.slug}/week/${week.week_number}`}
                                className="text-sm text-[#9494a8] hover:text-[#f8f8ff] transition-colors"
                            >
                                &larr; Back to Week
                            </Link>
                            <h1 className="text-xl font-bold mt-1">
                                Week {week.week_number}: {week.title}
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className={`flex items-center gap-2 text-sm ${isConnected ? 'text-[#4ade80]' : 'text-[#fb923c]'}`}>
                                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#4ade80]' : 'bg-[#fb923c] animate-pulse'}`} />
                                {isConnected ? 'Connected' : 'Connecting...'}
                            </div>
                            <a
                                href={`/series/${series.slug}/week/${week.week_number}/present`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-[#a78bfa] text-white rounded-lg font-semibold text-sm hover:bg-[#a78bfa]/80 transition-colors"
                            >
                                Open Presentation
                            </a>
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-12 gap-8">
                        {/* Left sidebar - Navigation outline */}
                        <aside className="col-span-4 space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
                            <h2 className="text-sm font-bold uppercase tracking-wide text-[#9494a8] mb-4 sticky top-0 bg-[#0a0a14] py-2">
                                Lesson Outline
                            </h2>

                            {week.sections.map((section, sIdx) => (
                                <div key={sIdx} className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-[#f8f8ff]">
                                        <span>{section.icon}</span>
                                        <span>{section.title}</span>
                                    </div>
                                    <div className="ml-6 space-y-2">
                                        {section.content.map((item, cIdx) => {
                                            const isActive = state.sectionIndex === sIdx && state.contentIndex === cIdx;
                                            const scriptureKey = `${sIdx}-${cIdx}`;
                                            const isScriptureExpanded = state.expandedScriptures.includes(scriptureKey);

                                            return (
                                                <ContentItemPreview
                                                    key={cIdx}
                                                    item={item}
                                                    sectionIndex={sIdx}
                                                    contentIndex={cIdx}
                                                    isActive={isActive}
                                                    isScriptureExpanded={isScriptureExpanded}
                                                    onSelect={() => goToItem(sIdx, cIdx)}
                                                    onToggleScripture={() => toggleScripture(sIdx, cIdx)}
                                                    onHighlightQuestion={(idx) => highlightQuestion(idx)}
                                                    highlightedQuestionIndex={state.highlightedQuestionIndex}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </aside>

                        {/* Right side - Controls and preview */}
                        <main className="col-span-8">
                            {/* Navigation controls */}
                            <div className="bg-[#1e1e32] rounded-xl p-6 mb-8">
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={() => navigate('previous')}
                                        disabled={currentFlatIndex === 0}
                                        className="px-8 py-4 bg-[#3e3e5a] text-white rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#4e4e6a] transition-colors"
                                    >
                                        &larr; Previous
                                    </button>

                                    <div className="text-center">
                                        <div className="text-sm text-[#9494a8]">
                                            Item {currentFlatIndex + 1} of {flattenedItems.length}
                                        </div>
                                        <div className="text-xs text-[#6e6e8a] mt-1">
                                            Section {state.sectionIndex + 1}, Item {state.contentIndex + 1}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigate('next')}
                                        disabled={currentFlatIndex === flattenedItems.length - 1}
                                        className="px-8 py-4 bg-[#a78bfa] text-white rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#a78bfa]/80 transition-colors"
                                    >
                                        Next &rarr;
                                    </button>
                                </div>

                                {/* Keyboard shortcuts hint */}
                                <div className="mt-4 text-center text-xs text-[#6e6e8a]">
                                    Tip: Use arrow keys or spacebar to navigate, Escape to clear highlight
                                </div>
                            </div>

                            {/* Current item preview */}
                            <div className="bg-[#1e1e32] rounded-xl p-6">
                                <h3 className="text-sm font-bold uppercase tracking-wide text-[#9494a8] mb-4">
                                    Currently Showing
                                </h3>

                                {flattenedItems[currentFlatIndex] && (
                                    <div className="bg-[#0a0a14] rounded-lg p-6">
                                        {(() => {
                                            const { item, sectionIndex } = flattenedItems[currentFlatIndex];
                                            const section = week.sections[sectionIndex];

                                            return (
                                                <div>
                                                    <div className="text-xs text-[#6e6e8a] mb-2">
                                                        {section.icon} {section.title}
                                                    </div>

                                                    {item.type === 'body' && (
                                                        <p className="text-lg text-[#f8f8ff]">{item.text}</p>
                                                    )}

                                                    {item.type === 'scripture' && (
                                                        <div>
                                                            <div className="text-xl font-semibold text-[#a78bfa] mb-2">{item.ref}</div>
                                                            <div
                                                                className="text-[#c4c4d4]"
                                                                dangerouslySetInnerHTML={{
                                                                    __html: (item.text || '').replace(
                                                                        /<span class="highlight">/g,
                                                                        '<span class="bg-[#fbbf24]/25 text-[#fcd34d] px-1 rounded">'
                                                                    ),
                                                                }}
                                                            />
                                                        </div>
                                                    )}

                                                    {item.type === 'prompts' && (
                                                        <div>
                                                            <div className="text-sm text-[#fb923c] font-semibold mb-2">Discussion Questions</div>
                                                            <ul className="space-y-2">
                                                                {item.questions?.map((q, i) => (
                                                                    <li
                                                                        key={i}
                                                                        className={`text-sm ${
                                                                            state.highlightedQuestionIndex === i
                                                                                ? 'text-[#fb923c] font-semibold'
                                                                                : 'text-[#c4c4d4]'
                                                                        }`}
                                                                    >
                                                                        {i + 1}. {q}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {item.type === 'callout' && (
                                                        <div>
                                                            <div className="text-lg font-semibold text-[#60a5fa] mb-2">{item.title}</div>
                                                            <div
                                                                className="text-[#c4c4d4] text-sm"
                                                                dangerouslySetInnerHTML={{ __html: item.content || '' }}
                                                            />
                                                        </div>
                                                    )}

                                                    {item.type === 'leaderNote' && (
                                                        <div className="border-l-4 border-[#fbbf24] pl-4">
                                                            <div className="text-sm text-[#fbbf24] font-semibold mb-1">Leader Note (not shown on projection)</div>
                                                            <p className="text-[#c4c4d4] italic">{item.text}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
}
