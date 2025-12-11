import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { type SharedData } from '@/types';
import MemoryVerse from '@/components/study/MemoryVerse';

interface ContentItem {
    type: 'body' | 'scripture' | 'prompts' | 'leaderNote' | 'callout';
    text?: string;
    ref?: string;
    questions?: string[];
    title?: string;
    content?: string;
}

interface Section {
    title: string;
    icon: string;
    content: ContentItem[];
}

interface Week {
    id: number;
    week_number: number;
    title: string;
    question: string;
    icon: string;
    memory_verse: string | null;
    memory_verse_ref: string | null;
    recap: string | null;
    next_week_title: string | null;
    next_week_homework: string | null;
    sections: Section[];
}

interface Series {
    id: number;
    title: string;
    slug: string;
}

interface Props {
    series: Series;
    week: Week;
    isLeader: boolean;
    totalWeeks: number;
}

function ScriptureCard({ reference, text, id }: { reference: string; text: string; id: string }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <article className="mb-4 overflow-hidden rounded-xl border-2 border-transparent bg-[#1e1e32] transition-colors focus-within:border-[#a78bfa]">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex w-full items-center justify-between bg-[#a78bfa]/10 px-6 py-4 text-left transition-colors hover:bg-[#a78bfa]/20"
                aria-expanded={isExpanded}
                aria-controls={`scripture-${id}`}
            >
                <span className="flex items-center gap-2 font-semibold text-[#a78bfa]">
                    <span>📖</span> {reference}
                </span>
                <span
                    className={`text-lg text-[#9494a8] transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                >
                    ▼
                </span>
            </button>
            <div
                id={`scripture-${id}`}
                className={`grid transition-all ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
                <div className="overflow-hidden">
                    <p
                        className="mx-6 my-4 border-l-4 border-[#fbbf24] pl-4 font-serif text-lg leading-relaxed text-[#c4c4d4]"
                        dangerouslySetInnerHTML={{
                            __html: text.replace(
                                /<span class="highlight">/g,
                                '<span class="bg-[#fbbf24]/25 text-[#fcd34d] px-1 rounded font-semibold">'
                            ),
                        }}
                    />
                </div>
            </div>
        </article>
    );
}

function PromptsCard({ questions }: { questions: string[] }) {
    return (
        <div className="mb-4 rounded-xl border-2 border-[#fb923c]/25 bg-[#fb923c]/10 p-6">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#fb923c]">
                <span>💬</span> Discussion Questions
            </div>
            <ul className="space-y-3">
                {questions.map((q, i) => (
                    <li key={i} className="flex gap-4 rounded-lg bg-black/20 p-4">
                        <span className="text-lg font-bold text-[#fb923c]">→</span>
                        <span className="text-[#f8f8ff]">{q}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function LeaderNote({ text }: { text: string }) {
    return (
        <aside className="my-4 rounded-lg border-2 border-dashed border-[#fbbf24]/40 bg-[#fbbf24]/10 px-6 py-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#fbbf24]">
                <span>🔑</span> Leader Note
            </div>
            <p className="font-serif italic text-[#c4c4d4]">{text}</p>
        </aside>
    );
}

function CalloutBox({ title, content }: { title: string; content: string }) {
    return (
        <aside className="mb-4 rounded-xl border-2 border-[#60a5fa]/25 bg-[#60a5fa]/10 p-6">
            <div className="mb-4 flex items-center gap-2 text-lg font-bold text-[#60a5fa]">
                <span>💡</span> {title}
            </div>
            <div
                className="text-[#c4c4d4] [&_ul]:mt-4 [&_ul]:list-none [&_ul]:space-y-2 [&_li]:relative [&_li]:pl-6 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:content-['→'] [&_li]:before:font-bold [&_li]:before:text-[#4ade80] [&_strong]:text-[#f8f8ff]"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </aside>
    );
}

export default function WeekDetail({ series, week, isLeader, totalWeeks }: Props) {
    const { auth } = usePage<SharedData>().props;
    const [showLeaderMode, setShowLeaderMode] = useState(false);

    const canToggleLeaderMode = isLeader;

    return (
        <>
            <Head title={`Week ${week.week_number}: ${week.title} | ${series.title}`}>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:ital,wght@0,400;0,700;1,400&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <div className="tn-page min-h-screen">
                <div className="tn-content">
                    {/* Header */}
                    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#121220]/95 backdrop-blur-xl">
                        <div className="mx-auto flex h-16 max-w-[42rem] items-center justify-between px-6">
                            <Link href="/" className="text-lg font-bold text-[#a78bfa] hover:opacity-80 transition-opacity">
                                thursdaynight<span className="text-[#f472b6]">.rocks</span>
                            </Link>
                            <nav className="flex items-center gap-2">
                                <Link
                                    href={`/series/${series.slug}`}
                                    className="flex h-11 w-11 items-center justify-center rounded-full text-[#9494a8] transition-all hover:bg-[#1e1e32] hover:text-[#f8f8ff]"
                                    aria-label="Back to series"
                                >
                                    🏠
                                </Link>
                                {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((num) => (
                                    <Link
                                        key={num}
                                        href={`/series/${series.slug}/week/${num}`}
                                        className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                                            num === week.week_number
                                                ? 'bg-[#a78bfa] text-[#121220]'
                                                : 'text-[#9494a8] hover:bg-[#1e1e32] hover:text-[#f8f8ff]'
                                        }`}
                                        aria-label={`Week ${num}`}
                                        aria-current={num === week.week_number ? 'page' : undefined}
                                    >
                                        {num}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </header>

                    {/* Content */}
                    <main className="mx-auto max-w-[42rem] px-6 pb-32">
                        {/* Back Button */}
                        <Link
                            href={`/series/${series.slug}`}
                            className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-transparent bg-[#1e1e32] px-6 py-3 text-[#c4c4d4] transition-all hover:border-[#a78bfa] hover:bg-[#2a2a45] hover:text-[#f8f8ff]"
                        >
                            <span>←</span> Back to Weeks
                        </Link>

                        {/* Header */}
                        <header className="py-8 text-center">
                            <span className="inline-block rounded-full bg-gradient-to-r from-[#a78bfa] to-[#f472b6] px-4 py-1 text-sm font-bold uppercase tracking-wide text-white">
                                Week {week.week_number}
                            </span>
                            <h1 className="mt-4 text-3xl font-bold text-[#f8f8ff] sm:text-4xl">
                                {week.title}
                            </h1>
                            <p className="mx-auto mt-4 max-w-md font-serif text-lg italic text-[#c4c4d4]">
                                {week.question}
                            </p>
                        </header>

                        {/* Leader Mode Toggle */}
                        {canToggleLeaderMode && (
                            <div className="mb-8 flex justify-center">
                                <button
                                    onClick={() => setShowLeaderMode(!showLeaderMode)}
                                    className={`rounded-full border-2 border-[#fbbf24] px-6 py-3 font-semibold transition-all ${
                                        showLeaderMode
                                            ? 'bg-[#fbbf24] text-[#121220]'
                                            : 'bg-[#1e1e32] text-[#f8f8ff] hover:scale-[1.02]'
                                    }`}
                                    aria-pressed={showLeaderMode}
                                >
                                    {showLeaderMode ? '🔑 Leader Mode ON' : '👤 Participant Mode'}
                                </button>
                            </div>
                        )}

                        {/* Memory Verse */}
                        {week.memory_verse && week.memory_verse_ref && (
                            <MemoryVerse
                                verse={week.memory_verse}
                                reference={week.memory_verse_ref}
                                weekId={week.id}
                            />
                        )}

                        {/* Recap */}
                        {week.recap && (
                            <aside className="mb-8 rounded-xl border-2 border-[#a78bfa]/30 bg-[#a78bfa]/10 p-6">
                                <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#a78bfa]">
                                    <span>↩</span> Recap from Week {week.week_number - 1}
                                </div>
                                <p className="text-[#c4c4d4]">{week.recap}</p>
                            </aside>
                        )}

                        {/* Sections */}
                        {week.sections.map((section, sIndex) => (
                            <section key={sIndex} className="mb-8">
                                <div className="mb-6 flex items-center gap-4 border-b-[3px] border-[#a78bfa] pb-4">
                                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#a78bfa] text-lg">
                                        {section.icon}
                                    </span>
                                    <h2 className="text-lg font-bold uppercase tracking-wide text-[#f8f8ff]">
                                        {section.title}
                                    </h2>
                                </div>

                                {section.content.map((item, iIndex) => {
                                    const key = `${sIndex}-${iIndex}`;

                                    switch (item.type) {
                                        case 'body':
                                            return (
                                                <p
                                                    key={key}
                                                    className="mb-6 text-lg leading-relaxed text-[#c4c4d4]"
                                                >
                                                    {item.text}
                                                </p>
                                            );

                                        case 'scripture':
                                            return (
                                                <ScriptureCard
                                                    key={key}
                                                    reference={item.ref || ''}
                                                    text={item.text || ''}
                                                    id={key}
                                                />
                                            );

                                        case 'prompts':
                                            return (
                                                <PromptsCard
                                                    key={key}
                                                    questions={item.questions || []}
                                                />
                                            );

                                        case 'leaderNote':
                                            // Only show if leader mode is on
                                            if (showLeaderMode && item.text) {
                                                return <LeaderNote key={key} text={item.text} />;
                                            }
                                            return null;

                                        case 'callout':
                                            return (
                                                <CalloutBox
                                                    key={key}
                                                    title={item.title || ''}
                                                    content={item.content || ''}
                                                />
                                            );

                                        default:
                                            return null;
                                    }
                                })}
                            </section>
                        ))}

                        {/* Next Week */}
                        {week.next_week_title && (
                            <aside className="mt-12 rounded-xl border-2 border-[#4ade80]/25 bg-[#4ade80]/10 p-6">
                                <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#4ade80]">
                                    <span>→</span> Next Week Preview
                                </div>
                                <h3 className="mb-4 text-xl font-bold text-[#f8f8ff]">
                                    {week.next_week_title}
                                </h3>
                                {week.next_week_homework && (
                                    <div className="border-l-4 border-[#4ade80] pl-4 text-[#c4c4d4]">
                                        <span className="font-semibold text-[#4ade80]">Homework: </span>
                                        {week.next_week_homework}
                                    </div>
                                )}
                            </aside>
                        )}

                        {/* Navigation */}
                        <div className="mt-12 flex justify-between gap-4">
                            {week.week_number > 1 ? (
                                <Link
                                    href={`/series/${series.slug}/week/${week.week_number - 1}`}
                                    className="inline-flex items-center gap-2 rounded-full border-2 border-transparent bg-[#1e1e32] px-6 py-3 text-[#c4c4d4] transition-all hover:border-[#a78bfa] hover:bg-[#2a2a45] hover:text-[#f8f8ff]"
                                >
                                    <span>←</span> Previous Week
                                </Link>
                            ) : (
                                <div />
                            )}
                            {week.week_number < totalWeeks ? (
                                <Link
                                    href={`/series/${series.slug}/week/${week.week_number + 1}`}
                                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#a78bfa] to-[#f472b6] px-6 py-3 font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-[#a78bfa]/40"
                                >
                                    Next Week <span>→</span>
                                </Link>
                            ) : (
                                <Link
                                    href={`/series/${series.slug}`}
                                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#a78bfa] to-[#f472b6] px-6 py-3 font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-[#a78bfa]/40"
                                >
                                    Back to Series <span>→</span>
                                </Link>
                            )}
                        </div>
                    </main>

                    {/* Floating Progress Button */}
                    <Link
                        href={`/series/${series.slug}`}
                        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#a78bfa] bg-[#1e1e32] text-sm font-bold text-[#f8f8ff] shadow-lg transition-all hover:scale-110 hover:bg-[#a78bfa]"
                        aria-label="Return to week selection"
                    >
                        {week.week_number}/{totalWeeks}
                    </Link>
                </div>
            </div>
        </>
    );
}
