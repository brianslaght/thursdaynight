import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import { usePresentation } from '@/hooks/use-presentation';
import type { PresentationState, PresentationSeries, PresentationWeek, Section } from '@/types/presentation';

interface Props {
    series: PresentationSeries;
    week: PresentationWeek;
    initialState: PresentationState;
}

function PresentationBody({ text }: { text: string }) {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-4xl md:text-5xl lg:text-6xl leading-relaxed text-center text-[#f8f8ff] max-w-5xl px-8">
                {text}
            </p>
        </div>
    );
}

function PresentationScripture({
    reference,
    text,
    isExpanded,
}: {
    reference: string;
    text: string;
    isExpanded: boolean;
}) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-8">
            <div className="text-3xl md:text-4xl font-semibold text-[#a78bfa] mb-8">
                {reference}
            </div>
            <div
                className={`overflow-hidden transition-all duration-700 ease-out ${
                    isExpanded ? 'max-h-[70vh] opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <blockquote
                    className="text-2xl md:text-3xl lg:text-4xl leading-relaxed text-center text-[#c4c4d4] max-w-5xl border-l-4 border-[#fbbf24] pl-8"
                    dangerouslySetInnerHTML={{
                        __html: text.replace(
                            /<span class="highlight">/g,
                            '<span class="bg-[#fbbf24]/25 text-[#fcd34d] px-2 rounded font-semibold">'
                        ),
                    }}
                />
            </div>
            {!isExpanded && (
                <div className="text-xl text-[#9494a8] mt-4 animate-pulse">
                    Waiting for leader to reveal...
                </div>
            )}
        </div>
    );
}

function PresentationPrompts({
    questions,
    highlightedIndex,
}: {
    questions: string[];
    highlightedIndex: number | null;
}) {
    // If a specific question is highlighted, only show that one
    if (highlightedIndex !== null && questions[highlightedIndex]) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] px-8">
                <div className="text-center">
                    <div className="text-8xl mb-8">?</div>
                    <p className="text-3xl md:text-4xl lg:text-5xl leading-relaxed text-[#f8f8ff] max-w-4xl">
                        {questions[highlightedIndex]}
                    </p>
                </div>
            </div>
        );
    }

    // Show all questions
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-8">
            <div className="text-sm font-bold uppercase tracking-wide text-[#fb923c] mb-8">
                Discussion Questions
            </div>
            <ul className="space-y-6 max-w-4xl">
                {questions.map((q, i) => (
                    <li
                        key={i}
                        className="text-2xl md:text-3xl text-[#f8f8ff] flex gap-6 items-start"
                    >
                        <span className="text-[#fb923c] font-bold">{i + 1}.</span>
                        <span>{q}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function PresentationCallout({ title, content }: { title: string; content: string }) {
    return (
        <div className="flex items-center justify-center min-h-[60vh] px-8">
            <div className="max-w-4xl text-center">
                <div className="text-2xl font-bold text-[#60a5fa] mb-8 flex items-center justify-center gap-4">
                    <span className="text-4xl">!</span> {title}
                </div>
                <div
                    className="text-xl md:text-2xl lg:text-3xl leading-relaxed text-[#c4c4d4] [&_strong]:text-[#f8f8ff] [&_ul]:mt-6 [&_ul]:text-left [&_li]:mb-4"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        </div>
    );
}

function SectionHeader({ title, icon }: { title: string; icon: string }) {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
                <span className="text-8xl mb-8 block">{icon}</span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#f8f8ff]">
                    {title}
                </h2>
            </div>
        </div>
    );
}

function CurrentContent({
    sections,
    state,
}: {
    sections: Section[];
    state: PresentationState;
}) {
    const section = sections[state.sectionIndex];

    if (!section) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center text-[#9494a8]">
                    <div className="text-6xl mb-4">...</div>
                    <p className="text-xl">Waiting for presentation to start</p>
                </div>
            </div>
        );
    }

    const item = section.content[state.contentIndex];

    if (!item) {
        // Show section header if no content item
        return <SectionHeader title={section.title} icon={section.icon} />;
    }

    const scriptureKey = `${state.sectionIndex}-${state.contentIndex}`;
    const isScriptureExpanded = state.expandedScriptures.includes(scriptureKey);

    switch (item.type) {
        case 'body':
            return <PresentationBody text={item.text || ''} />;

        case 'scripture':
            return (
                <PresentationScripture
                    reference={item.ref || ''}
                    text={item.text || ''}
                    isExpanded={isScriptureExpanded}
                />
            );

        case 'prompts':
            return (
                <PresentationPrompts
                    questions={item.questions || []}
                    highlightedIndex={state.highlightedQuestionIndex}
                />
            );

        case 'callout':
            return (
                <PresentationCallout
                    title={item.title || ''}
                    content={item.content || ''}
                />
            );

        default:
            return <div className="text-center text-[#9494a8]">Unknown content type</div>;
    }
}

export default function PresentationView({ series, week, initialState }: Props) {
    const { state, isConnected, connectionIssue } = usePresentation({
        weekId: week.id,
        initialState,
        isController: false,
    });

    // Prevent screen sleep
    useEffect(() => {
        let wakeLock: WakeLockSentinel | null = null;

        async function requestWakeLock() {
            try {
                if ('wakeLock' in navigator) {
                    wakeLock = await navigator.wakeLock.request('screen');
                }
            } catch {
                console.log('Wake Lock not supported');
            }
        }

        requestWakeLock();

        return () => {
            wakeLock?.release();
        };
    }, []);

    return (
        <>
            <Head title={`Presenting: ${week.title}`} />
            <div className="min-h-screen bg-[#0a0a14] text-[#f8f8ff] flex flex-col">
                {/* Header bar - minimal */}
                <header className="h-16 flex items-center justify-between px-6 bg-[#121220]/80 border-b border-white/5">
                    <div className="text-sm text-[#9494a8]">
                        Week {week.week_number}: {week.title}
                    </div>
                    <div className={`flex items-center gap-2 text-xs ${isConnected ? 'text-[#4ade80]' : 'text-[#fb923c]'}`}>
                        <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#4ade80]' : 'bg-[#fb923c] animate-pulse'}`} />
                        {isConnected ? 'Connected' : connectionIssue ?? 'Connecting...'}
                    </div>
                </header>

                {/* Main content area */}
                <main className="flex-1 flex items-center justify-center p-8">
                    <CurrentContent sections={week.sections} state={state} />
                </main>

                {/* Footer - progress indicator */}
                <footer className="h-12 flex items-center justify-center px-6 bg-[#121220]/80 border-t border-white/5">
                    <div className="flex gap-2">
                        {week.sections.map((_, sIdx) => (
                            <div
                                key={sIdx}
                                className={`w-3 h-3 rounded-full transition-all ${
                                    sIdx === state.sectionIndex
                                        ? 'bg-[#a78bfa] scale-125'
                                        : sIdx < state.sectionIndex
                                        ? 'bg-[#4ade80]'
                                        : 'bg-[#3e3e5a]'
                                }`}
                            />
                        ))}
                    </div>
                </footer>
            </div>
        </>
    );
}
