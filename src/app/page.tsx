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

    // Redirect to play if already logged in
    useEffect(() => {
        if (user && !loading) {
            router.push('/play');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin text-6xl">⛏️</div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-tunnel-bg">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-tunnel-bg/80 to-tunnel-bg z-10" />

                {/* Hero image - the meme */}
                <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-dirt-dark via-dirt to-dirt-dark">
                        {/* Meme-inspired visual */}
                        <div className="relative w-full max-w-lg mx-auto p-8">
                            {/* Top panel - giving up */}
                            <div className="relative bg-tunnel-wall rounded-lg p-4 mb-2 border-2 border-dirt">
                                <div className="flex items-center justify-between">
                                    <div className="text-4xl">😢</div>
                                    <div className="flex-1 mx-4 h-3 bg-dirt-dark rounded-full overflow-hidden">
                                        <div className="h-full w-3/4 bg-gradient-to-r from-dirt to-dirt-light" />
                                    </div>
                                    <div className="flex gap-1">
                                        {[...Array(3)].map((_, i) => (
                                            <span key={i} className="text-2xl">💎</span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-center text-red-400 text-sm mt-2 font-bold">GAVE UP</p>
                            </div>

                            {/* Bottom panel - keeping digging */}
                            <div className="relative bg-tunnel-wall rounded-lg p-4 border-2 border-diamond">
                                <div className="flex items-center justify-between">
                                    <div className="text-4xl">💪</div>
                                    <div className="flex-1 mx-4 h-3 bg-dirt-dark rounded-full overflow-hidden">
                                        <div className="h-full w-full bg-gradient-to-r from-dirt via-amber-500 to-diamond" />
                                    </div>
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className="text-2xl animate-pulse">💎</span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-center text-green-400 text-sm mt-2 font-bold">KEPT DIGGING! 🏆</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="relative z-20 px-4 py-8 -mt-20">
                <div className="max-w-md mx-auto text-center">
                    {/* Title */}
                    <h1 className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 mb-4 drop-shadow-lg">
                        DIG & BUST
                    </h1>

                    <p className="text-xl text-gray-300 mb-2">
                        ⛏️ <span className="text-amber-400 font-bold">KEEP DIGGING!</span> ⛏️
                    </p>

                    <p className="text-gray-400 mb-8 max-w-sm mx-auto">
                        Dig through the dirt to reach the <span className="text-diamond font-semibold">Diamond Wall</span>.
                        But be careful — dig too deep and you might <span className="text-red-400 font-semibold">BUST!</span>
                    </p>

                    {/* CTA Buttons */}
                    <div className="space-y-4">
                        <button
                            onClick={() => setShowAuth(true)}
                            className="w-full py-4 px-8 text-xl font-bold rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-400 hover:via-yellow-400 hover:to-amber-400 text-tunnel-bg transition-all transform hover:scale-105 shadow-lg hover:shadow-amber-500/30"
                        >
                            ⛏️ Start Digging!
                        </button>

                        <Link
                            href="/leaderboard"
                            className="block w-full py-3 px-8 text-lg font-semibold rounded-xl bg-tunnel-wall border-2 border-dirt hover:border-amber-500 text-gray-300 hover:text-white transition-all"
                        >
                            🏆 Leaderboard
                        </Link>
                    </div>

                    {/* Game Features */}
                    <div className="mt-12 grid grid-cols-3 gap-4 text-center">
                        <div className="bg-tunnel-wall/50 rounded-lg p-4">
                            <div className="text-3xl mb-2">💎</div>
                            <div className="text-xs text-gray-400">Find Gems</div>
                        </div>
                        <div className="bg-tunnel-wall/50 rounded-lg p-4">
                            <div className="text-3xl mb-2">🏆</div>
                            <div className="text-xs text-gray-400">Hit Jackpot</div>
                        </div>
                        <div className="bg-tunnel-wall/50 rounded-lg p-4">
                            <div className="text-3xl mb-2">📊</div>
                            <div className="text-xs text-gray-400">Leaderboard</div>
                        </div>
                    </div>

                    {/* How to play */}
                    <div className="mt-8 text-left bg-tunnel-wall/30 rounded-xl p-4">
                        <h3 className="font-bold text-amber-400 mb-3">How to Play:</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li>⛏️ Click <strong>DIG</strong> to dig through dirt blocks</li>
                            <li>💎 Find gems to earn points</li>
                            <li>💥 Avoid busting — game over if you hit a dud!</li>
                            <li>🏆 Dig 30+ times to unlock <span className="text-diamond">Jackpot</span> chance</li>
                            <li>📈 The deeper you go, the higher the risk AND reward!</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="text-center py-6 text-gray-500 text-sm">
                <p>Don&apos;t give up. You were <span className="text-amber-400">THIS</span> close! 💎</p>
            </footer>

            {/* Auth Modal */}
            <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
        </main>
    );
}
