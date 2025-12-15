'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import AuthModal from '@/components/AuthModal';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [showAuth, setShowAuth] = useState(false);

    useEffect(() => {
        if (user && !loading) {
            router.push('/play');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-950 flex items-center justify-center">
                <div className="animate-spin text-5xl">⛏️</div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-950">
            {/* Hero */}
            <div className="relative pt-12 pb-8 px-4">
                <div className="max-w-md mx-auto">

                    {/* Meme Image */}
                    <div className="card overflow-hidden mb-8">
                        <div className="relative h-64">
                            <Image
                                src="/meme.png"
                                alt="Never give up meme"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-black text-gradient mb-2">
                            NEVER GIVE UP
                        </h1>
                        <p className="text-dark-300">
                            The classic meme, now a game. Keep digging!
                        </p>
                    </div>

                    {/* CTA */}
                    <div className="space-y-3 mb-10">
                        <button
                            onClick={() => setShowAuth(true)}
                            className="w-full py-4 text-lg font-bold rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary-500/25"
                        >
                            ⛏️ Start Mining
                        </button>

                        <Link
                            href="/leaderboard"
                            className="block w-full py-3 text-center font-semibold rounded-xl bg-dark-800 border border-dark-600 text-dark-200 hover:text-white hover:border-dark-500 transition-all"
                        >
                            🏆 Leaderboard
                        </Link>
                    </div>

                    {/* How it works */}
                    <div className="card p-5 mb-6">
                        <h3 className="font-bold text-white mb-4">How to Play</h3>
                        <div className="space-y-3 text-sm text-dark-300">
                            <div className="flex items-start gap-3">
                                <span className="text-primary-400">⛏️</span>
                                <span>Click <strong className="text-white">DIG</strong> to mine through dirt</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-secondary-400">💎</span>
                                <span>Find gems to earn points</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-danger">💥</span>
                                <span>Don't bust! Game over if you hit a dud</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-warning">🏆</span>
                                <span>Dig 30+ times to unlock jackpot</span>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="card p-4 text-center">
                            <div className="text-2xl mb-1">💎</div>
                            <div className="text-xs text-dark-400">Find Gems</div>
                        </div>
                        <div className="card p-4 text-center">
                            <div className="text-2xl mb-1">🏆</div>
                            <div className="text-xs text-dark-400">Win Big</div>
                        </div>
                        <div className="card p-4 text-center">
                            <div className="text-2xl mb-1">📊</div>
                            <div className="text-xs text-dark-400">Compete</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="text-center py-8 text-dark-500 text-sm">
                <p>Never give up. You were <span className="text-primary-400">THIS</span> close! 💎</p>
            </footer>

            <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
        </main>
    );
}
