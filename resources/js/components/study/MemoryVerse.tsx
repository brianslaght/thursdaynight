import { useState, useEffect, useMemo } from 'react';

interface MemoryVerseProps {
    verse: string;
    reference: string;
    weekId: number;
}

type Level = 1 | 2 | 3;
type GameState = 'display' | 'playing' | 'success';

function getStorageKey(weekId: number): string {
    return `tn-memory-verse-${weekId}`;
}

function getProgress(weekId: number): { level: Level; completed: boolean } {
    if (typeof window === 'undefined') return { level: 1, completed: false };
    const stored = localStorage.getItem(getStorageKey(weekId));
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            return { level: 1, completed: false };
        }
    }
    return { level: 1, completed: false };
}

function saveProgress(weekId: number, level: Level, completed: boolean): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(getStorageKey(weekId), JSON.stringify({ level, completed }));
}

export default function MemoryVerse({ verse, reference, weekId }: MemoryVerseProps) {
    const [gameState, setGameState] = useState<GameState>('display');
    const [currentLevel, setCurrentLevel] = useState<Level>(1);
    const [userInput, setUserInput] = useState('');
    const [showHint, setShowHint] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [revealedWords, setRevealedWords] = useState<Set<number>>(new Set());

    // Load progress on mount
    useEffect(() => {
        const progress = getProgress(weekId);
        setCurrentLevel(progress.level);
        setIsCompleted(progress.completed);
    }, [weekId]);

    const words = useMemo(() => verse.split(/\s+/), [verse]);

    // Level 1: Fill the gaps (every 3rd word is blanked)
    const level1Display = useMemo(() => {
        return words.map((word, i) => {
            const isBlank = (i + 1) % 3 === 0;
            const isRevealed = revealedWords.has(i);
            if (isBlank && !isRevealed) {
                return { type: 'blank' as const, word, index: i };
            }
            return { type: 'visible' as const, word, index: i };
        });
    }, [words, revealedWords]);

    // Level 2: First letters only
    const level2Display = useMemo(() => {
        return words.map((word) => {
            const firstLetter = word.charAt(0);
            const rest = word.slice(1).replace(/[a-zA-Z]/g, '_');
            return firstLetter + rest;
        }).join(' ');
    }, [words]);

    const handleBlankClick = (index: number) => {
        setRevealedWords(prev => new Set([...prev, index]));

        // Check if all blanks are revealed
        const totalBlanks = words.filter((_, i) => (i + 1) % 3 === 0).length;
        const newRevealedCount = revealedWords.size + 1;

        if (newRevealedCount >= totalBlanks) {
            setTimeout(() => handleLevelComplete(), 500);
        }
    };

    const handleLevel3Submit = () => {
        // Normalize both strings for comparison
        const normalizeText = (text: string) =>
            text.toLowerCase()
                .replace(/[^\w\s]/g, '')
                .replace(/\s+/g, ' ')
                .trim();

        const normalizedInput = normalizeText(userInput);
        const normalizedVerse = normalizeText(verse);

        // Check if at least 80% similar (allows for minor typos)
        const similarity = calculateSimilarity(normalizedInput, normalizedVerse);

        if (similarity >= 0.8) {
            handleLevelComplete();
        } else {
            setShowHint(true);
            setTimeout(() => setShowHint(false), 3000);
        }
    };

    const calculateSimilarity = (a: string, b: string): number => {
        const aWords = a.split(' ');
        const bWords = b.split(' ');
        let matches = 0;

        aWords.forEach((word, i) => {
            if (bWords[i] && (word === bWords[i] || levenshteinDistance(word, bWords[i]) <= 2)) {
                matches++;
            }
        });

        return matches / Math.max(aWords.length, bWords.length);
    };

    const levenshteinDistance = (a: string, b: string): number => {
        const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

        for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
        for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

        for (let j = 1; j <= b.length; j++) {
            for (let i = 1; i <= a.length; i++) {
                const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
                matrix[j][i] = Math.min(
                    matrix[j][i - 1] + 1,
                    matrix[j - 1][i] + 1,
                    matrix[j - 1][i - 1] + indicator
                );
            }
        }

        return matrix[b.length][a.length];
    };

    const handleLevelComplete = () => {
        if (currentLevel < 3) {
            const nextLevel = (currentLevel + 1) as Level;
            setCurrentLevel(nextLevel);
            saveProgress(weekId, nextLevel, false);
            setRevealedWords(new Set());
            setUserInput('');
        } else {
            setIsCompleted(true);
            saveProgress(weekId, 3, true);
            setGameState('success');
        }
    };

    const startPractice = () => {
        setGameState('playing');
        setRevealedWords(new Set());
        setUserInput('');
    };

    const resetProgress = () => {
        setCurrentLevel(1);
        setIsCompleted(false);
        setRevealedWords(new Set());
        setUserInput('');
        saveProgress(weekId, 1, false);
        setGameState('display');
    };

    return (
        <div className="mb-8 overflow-hidden rounded-xl border-2 border-[#a78bfa] bg-gradient-to-br from-[#a78bfa]/20 to-[#f472b6]/10">
            {/* Header */}
            <div className="flex items-center justify-between bg-[#a78bfa]/20 px-6 py-4">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">✨</span>
                    <span className="font-bold uppercase tracking-wide text-[#a78bfa]">
                        Memory Verse
                    </span>
                </div>
                {isCompleted && (
                    <span className="rounded-full bg-[#4ade80] px-3 py-1 text-xs font-bold text-[#121220]">
                        Mastered!
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-6">
                {gameState === 'display' && (
                    <>
                        <blockquote className="mb-4 font-serif text-xl leading-relaxed text-[#f8f8ff]">
                            "{verse}"
                        </blockquote>
                        <cite className="mb-6 block text-[#c4c4d4]">— {reference}</cite>

                        <button
                            onClick={startPractice}
                            className="w-full rounded-xl bg-gradient-to-r from-[#a78bfa] to-[#f472b6] py-4 font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-[#a78bfa]/40"
                        >
                            {isCompleted ? '🎉 Practice Again' : '📝 Practice This Verse'}
                        </button>

                        {isCompleted && (
                            <button
                                onClick={resetProgress}
                                className="mt-2 w-full py-2 text-sm text-[#9494a8] hover:text-[#f8f8ff]"
                            >
                                Reset Progress
                            </button>
                        )}
                    </>
                )}

                {gameState === 'playing' && (
                    <div>
                        {/* Level Indicator */}
                        <div className="mb-6 flex items-center justify-center gap-2">
                            {[1, 2, 3].map((level) => (
                                <div
                                    key={level}
                                    className={`flex h-10 w-10 items-center justify-center rounded-full font-bold transition-all ${
                                        level < currentLevel
                                            ? 'bg-[#4ade80] text-[#121220]'
                                            : level === currentLevel
                                            ? 'bg-[#a78bfa] text-white'
                                            : 'bg-[#1e1e32] text-[#9494a8]'
                                    }`}
                                >
                                    {level < currentLevel ? '✓' : level}
                                </div>
                            ))}
                        </div>

                        <div className="mb-2 text-center text-sm font-semibold uppercase tracking-wide text-[#f472b6]">
                            {currentLevel === 1 && 'Level 1: Tap to Reveal'}
                            {currentLevel === 2 && 'Level 2: First Letters'}
                            {currentLevel === 3 && 'Level 3: Full Recall'}
                        </div>

                        {/* Level 1: Fill the gaps */}
                        {currentLevel === 1 && (
                            <div className="mb-6 rounded-xl bg-[#1e1e32] p-6">
                                <p className="font-serif text-lg leading-relaxed">
                                    {level1Display.map((item, i) => (
                                        <span key={i}>
                                            {item.type === 'blank' ? (
                                                <button
                                                    onClick={() => handleBlankClick(item.index)}
                                                    className="mx-1 inline-block min-w-[60px] rounded bg-[#a78bfa]/30 px-2 py-1 font-sans text-[#a78bfa] transition-all hover:bg-[#a78bfa]/50"
                                                >
                                                    ?
                                                </button>
                                            ) : (
                                                <span className="text-[#f8f8ff]">{item.word} </span>
                                            )}
                                        </span>
                                    ))}
                                </p>
                                <p className="mt-4 text-right text-sm text-[#9494a8]">— {reference}</p>
                            </div>
                        )}

                        {/* Level 2: First letters */}
                        {currentLevel === 2 && (
                            <div className="mb-6 rounded-xl bg-[#1e1e32] p-6">
                                <p className="mb-4 font-mono text-lg leading-relaxed text-[#c4c4d4]">
                                    {level2Display}
                                </p>
                                <p className="mb-4 text-right text-sm text-[#9494a8]">— {reference}</p>
                                <textarea
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    placeholder="Type the verse from memory..."
                                    className="w-full rounded-lg border-2 border-[#3e3e5a] bg-[#121220] p-4 font-serif text-[#f8f8ff] placeholder-[#9494a8] focus:border-[#a78bfa] focus:outline-none"
                                    rows={4}
                                />
                                <button
                                    onClick={() => {
                                        const normalizeText = (text: string) =>
                                            text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
                                        if (calculateSimilarity(normalizeText(userInput), normalizeText(verse)) >= 0.7) {
                                            handleLevelComplete();
                                        } else {
                                            setShowHint(true);
                                            setTimeout(() => setShowHint(false), 3000);
                                        }
                                    }}
                                    className="mt-4 w-full rounded-xl bg-[#a78bfa] py-3 font-semibold text-white transition-all hover:bg-[#a78bfa]/80"
                                >
                                    Check Answer
                                </button>
                            </div>
                        )}

                        {/* Level 3: Full recall */}
                        {currentLevel === 3 && (
                            <div className="mb-6 rounded-xl bg-[#1e1e32] p-6">
                                <p className="mb-4 text-center text-2xl font-bold text-[#fbbf24]">
                                    {reference}
                                </p>
                                <textarea
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    placeholder="Type the entire verse from memory..."
                                    className="w-full rounded-lg border-2 border-[#3e3e5a] bg-[#121220] p-4 font-serif text-[#f8f8ff] placeholder-[#9494a8] focus:border-[#a78bfa] focus:outline-none"
                                    rows={4}
                                />
                                <button
                                    onClick={handleLevel3Submit}
                                    className="mt-4 w-full rounded-xl bg-gradient-to-r from-[#a78bfa] to-[#f472b6] py-3 font-semibold text-white transition-all hover:scale-[1.02]"
                                >
                                    Submit Final Answer
                                </button>
                            </div>
                        )}

                        {showHint && (
                            <div className="mb-4 rounded-lg bg-[#fb923c]/20 p-4 text-center text-[#fb923c]">
                                Not quite! Try again. Check your spelling and word order.
                            </div>
                        )}

                        <button
                            onClick={() => setGameState('display')}
                            className="w-full py-2 text-sm text-[#9494a8] hover:text-[#f8f8ff]"
                        >
                            ← Back to Verse
                        </button>
                    </div>
                )}

                {gameState === 'success' && (
                    <div className="text-center">
                        <div className="mb-4 text-6xl">🎉</div>
                        <h3 className="mb-2 text-2xl font-bold text-[#4ade80]">
                            Verse Mastered!
                        </h3>
                        <p className="mb-6 text-[#c4c4d4]">
                            You've successfully memorized {reference}
                        </p>
                        <blockquote className="mb-6 rounded-xl bg-[#1e1e32] p-6 font-serif text-lg text-[#f8f8ff]">
                            "{verse}"
                        </blockquote>
                        <button
                            onClick={() => setGameState('display')}
                            className="rounded-xl bg-[#a78bfa] px-8 py-3 font-semibold text-white transition-all hover:bg-[#a78bfa]/80"
                        >
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
