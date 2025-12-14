'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import DiggingGame from '@/components/DiggingGame';
import AuthModal from '@/components/AuthModal';

export default function PlayPage() {
    const router = useRouter();
    const { user, loading, signOut } = useAuth();
    const [showAuth, setShowAuth] = useState(false);

    // Show auth modal if not logged in
    useEffect(() => {
        if (!loading && !user) {
            setShowAuth(true);
        }
    }, [user, loading]);

    // Close auth modal when user logs in
    useEffect(() => {
        if (user) {
            setShowAuth(false);
        }
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-tunnel-bg">
                <div className="animate-spin text-6xl">⛏️</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-tunnel-bg">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-tunnel-bg/90 backdrop-blur-sm border-b border-dirt-dark">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold text-amber-400 hover:text-amber-300 transition-colors">
                        ⛏️ Dig & Bust
                    </Link>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/leaderboard"
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            🏆 Leaderboard
                        </Link>

                        {user && (
                            <button
                                onClick={signOut}
                                className="text-sm text-gray-400 hover:text-red-400 transition-colors"
                            >
                                Sign Out
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Main game area */}
            <main className="pt-16">
                {user ? (
                    <DiggingGame />
                ) : (
                    <div className="min-h-[80vh] flex items-center justify-center p-4">
                        <div className="text-center">
                            <div className="text-6xl mb-4">🔒</div>
                            <h2 className="text-2xl font-bold text-amber-400 mb-2">Sign In to Play</h2>
                            <p className="text-gray-400 mb-6">Choose a way to enter the mine!</p>
                            <button
                                onClick={() => setShowAuth(true)}
                                className="py-3 px-8 text-lg font-bold rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-tunnel-bg transition-all"
                            >
                                Enter the Mine ⛏️
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {/* Auth Modal */}
            <AuthModal isOpen={showAuth} onClose={user ? () => setShowAuth(false) : undefined} />
        </div>
    );
}
