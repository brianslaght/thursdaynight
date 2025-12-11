import { Head, Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

interface Series {
    id: number;
    title: string;
    subtitle: string;
    badge_text: string;
    description: string | null;
    key_verse: string;
    key_verse_ref: string;
    slug: string;
    icon: string | null;
    weeks_count: number;
}

interface Props {
    series: Series[];
}

export default function Home({ series }: Props) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Thursday Night">
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
                        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
                            <Link href="/" className="text-lg font-bold text-[#a78bfa] hover:opacity-80 transition-opacity">
                                thursdaynight<span className="text-[#f472b6]">.rocks</span>
                            </Link>
                            <nav className="flex items-center gap-4">
                                {auth.user ? (
                                    <Link
                                        href="/dashboard"
                                        className="rounded-full border border-[#a78bfa] px-4 py-2 text-sm font-medium text-[#a78bfa] transition-all hover:bg-[#a78bfa] hover:text-[#121220]"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="rounded-full border border-[#a78bfa] px-4 py-2 text-sm font-medium text-[#a78bfa] transition-all hover:bg-[#a78bfa] hover:text-[#121220]"
                                    >
                                        Leader Login
                                    </Link>
                                )}
                            </nav>
                        </div>
                    </header>

                    {/* Hero */}
                    <section className="px-6 py-16 text-center">
                        <div className="mx-auto max-w-2xl">
                            <h1 className="mb-4 text-4xl font-bold text-[#f8f8ff] sm:text-5xl">
                                Thursday Night
                            </h1>
                            <p className="mb-8 font-serif text-xl italic text-[#c4c4d4]">
                                Bible Study Series
                            </p>
                            <div className="rounded-xl border-l-4 border-[#fbbf24] bg-[#1e1e32] p-6 text-left">
                                <blockquote className="font-serif text-lg leading-relaxed text-[#c4c4d4]">
                                    <span className="text-[#fcd34d] font-semibold">
                                        "Come now, let us reason together,"
                                    </span>{' '}
                                    says the Lord.
                                </blockquote>
                                <cite className="mt-3 block text-sm text-[#9494a8]">
                                    — Isaiah 1:18 (ESV)
                                </cite>
                            </div>
                        </div>
                    </section>

                    {/* Series List */}
                    <main className="mx-auto max-w-4xl px-6 pb-16">
                        <div className="mb-8 flex items-center gap-4">
                            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-[#9494a8]">
                                Available Series
                            </h2>
                            <div className="h-px flex-1 bg-gradient-to-r from-[#9494a8] to-transparent" />
                        </div>

                        <div className="grid gap-4">
                            {series.map((s) => (
                                <Link
                                    key={s.id}
                                    href={`/series/${s.slug}`}
                                    className="group relative block rounded-xl border-2 border-transparent bg-[#1e1e32] p-6 transition-all hover:-translate-y-0.5 hover:border-[#a78bfa] hover:bg-[#2a2a45]"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <span className="inline-block rounded-full border border-[#a78bfa] bg-[#a78bfa]/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#a78bfa]">
                                                {s.badge_text}
                                            </span>
                                            <h3 className="mt-3 text-xl font-semibold text-[#f8f8ff]">
                                                {s.title}
                                            </h3>
                                            <p className="mt-1 font-serif italic text-[#c4c4d4]">
                                                {s.subtitle}
                                            </p>
                                            <div className="mt-4 rounded-lg border-l-4 border-[#fbbf24] bg-black/20 p-3">
                                                <p className="font-serif text-sm text-[#c4c4d4]">
                                                    "{s.key_verse}"
                                                </p>
                                                <cite className="mt-1 block text-xs text-[#9494a8]">
                                                    — {s.key_verse_ref}
                                                </cite>
                                            </div>
                                        </div>
                                        <span className="ml-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#a78bfa]/15 text-2xl">
                                            {s.icon || '📖'}
                                        </span>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-sm text-[#9494a8]">
                                            {s.weeks_count} weeks
                                        </span>
                                        <span className="text-xl text-[#9494a8] transition-all group-hover:translate-x-1 group-hover:text-[#f472b6]">
                                            →
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {series.length === 0 && (
                            <div className="rounded-xl border-2 border-dashed border-[#3e3e5a] p-12 text-center">
                                <p className="text-[#9494a8]">No series available yet.</p>
                            </div>
                        )}
                    </main>

                    {/* Footer */}
                    <footer className="border-t border-white/10 py-8">
                        <div className="mx-auto max-w-4xl px-6 text-center">
                            <p className="text-sm text-[#9494a8]">
                                ThursdayNight.rocks
                            </p>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}
