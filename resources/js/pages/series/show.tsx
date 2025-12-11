import { Head, Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

interface Week {
    id: number;
    week_number: number;
    title: string;
    question: string;
    icon: string;
}

interface Series {
    id: number;
    title: string;
    subtitle: string;
    badge_text: string;
    key_verse: string;
    key_verse_ref: string;
    slug: string;
}

interface Props {
    series: Series;
    weeks: Week[];
}

export default function SeriesShow({ series, weeks }: Props) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title={`${series.title} | Thursday Night`}>
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
                                    href="/"
                                    className="flex h-11 w-11 items-center justify-center rounded-full text-[#9494a8] transition-all hover:bg-[#1e1e32] hover:text-[#f8f8ff]"
                                    aria-label="Home"
                                >
                                    🏠
                                </Link>
                                {weeks.map((week) => (
                                    <Link
                                        key={week.id}
                                        href={`/series/${series.slug}/week/${week.week_number}`}
                                        className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold text-[#9494a8] transition-all hover:border-[#a78bfa] hover:bg-[#1e1e32] hover:text-[#f8f8ff]"
                                        aria-label={`Week ${week.week_number}`}
                                    >
                                        {week.week_number}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </header>

                    {/* Hero */}
                    <main className="mx-auto max-w-[42rem] px-6">
                        <section className="py-12 text-center">
                            <span className="inline-block rounded-full border border-[#a78bfa] bg-[#a78bfa]/15 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-[#a78bfa]">
                                {series.badge_text}
                            </span>
                            <h1 className="mt-4 text-4xl font-bold text-[#f8f8ff] sm:text-5xl">
                                {series.title}
                            </h1>
                            <p className="mt-2 font-serif text-xl italic text-[#c4c4d4]">
                                {series.subtitle}
                            </p>

                            <figure className="mt-8 rounded-xl border-l-4 border-[#fbbf24] bg-[#1e1e32] p-6 text-left">
                                <blockquote className="font-serif text-lg leading-relaxed text-[#c4c4d4]">
                                    <span className="font-semibold text-[#fcd34d]">
                                        {series.key_verse.split(' ').slice(0, 6).join(' ')}
                                    </span>{' '}
                                    {series.key_verse.split(' ').slice(6).join(' ')}
                                </blockquote>
                                <figcaption>
                                    <cite className="mt-3 block text-base text-[#9494a8]">
                                        — {series.key_verse_ref}
                                    </cite>
                                </figcaption>
                            </figure>
                        </section>

                        {/* Weeks */}
                        <section className="pb-16">
                            <div className="mb-6 flex items-center gap-4">
                                <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-[#9494a8]">
                                    Choose a Week
                                </h2>
                                <div className="h-px flex-1 bg-gradient-to-r from-[#9494a8] to-transparent" />
                            </div>

                            <div className="flex flex-col gap-4">
                                {weeks.map((week) => (
                                    <Link
                                        key={week.id}
                                        href={`/series/${series.slug}/week/${week.week_number}`}
                                        className="group relative block rounded-xl border-2 border-transparent bg-[#1e1e32] p-6 transition-all hover:-translate-y-0.5 hover:border-[#a78bfa] hover:bg-[#2a2a45]"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 pr-12">
                                                <span className="text-sm font-bold uppercase tracking-wide text-[#f472b6]">
                                                    Week {week.week_number}
                                                </span>
                                                <h3 className="mt-1 text-xl font-semibold text-[#f8f8ff]">
                                                    {week.title}
                                                </h3>
                                                <p className="mt-2 font-serif italic text-[#c4c4d4]">
                                                    {week.question}
                                                </p>
                                            </div>
                                            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#a78bfa]/15 text-xl">
                                                {week.icon}
                                            </span>
                                        </div>
                                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xl text-[#9494a8] transition-all group-hover:translate-x-1 group-hover:text-[#f472b6]">
                                            →
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    </main>

                    {/* Floating Home Button */}
                    <Link
                        href="/"
                        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#a78bfa] bg-[#1e1e32] text-base font-bold text-[#f8f8ff] shadow-lg transition-all hover:scale-110 hover:bg-[#a78bfa]"
                        aria-label="Return to home"
                    >
                        📖
                    </Link>
                </div>
            </div>
        </>
    );
}
