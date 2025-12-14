import Link from 'next/link';
import Leaderboard from '@/components/Leaderboard';

export const metadata = {
    title: 'Leaderboard - Dig & Bust',
    description: 'See the top miners on the Dig & Bust leaderboard!',
};

export default function LeaderboardPage() {
    return (
        <div className="min-h-screen bg-tunnel-bg">
            {/* Header */}
            <header className="bg-tunnel-bg/90 backdrop-blur-sm border-b border-dirt-dark sticky top-0 z-40">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold text-amber-400 hover:text-amber-300 transition-colors">
                        ⛏️ Dig & Bust
                    </Link>

                    <Link
                        href="/play"
                        className="py-2 px-4 text-sm font-semibold rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white transition-all"
                    >
                        🎮 Play Now
                    </Link>
                </div>
            </header>

            {/* Main content */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300 mb-2">
                        🏆 Leaderboard
                    </h1>
                    <p className="text-gray-400">
                        Top miners who reached the Diamond Wall
                    </p>
                </div>

                {/* Leaderboard component */}
                <Leaderboard limit={50} showToday={true} />

                {/* CTA */}
                <div className="mt-8 text-center">
                    <p className="text-gray-400 mb-4">Think you can do better?</p>
                    <Link
                        href="/play"
                        className="inline-block py-3 px-8 text-lg font-bold rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-tunnel-bg transition-all transform hover:scale-105"
                    >
                        ⛏️ Start Digging!
                    </Link>
                </div>
            </main>

            {/* Footer */}
            <footer className="text-center py-6 text-gray-500 text-sm border-t border-dirt-dark mt-8">
                <p>Keep digging! 💎</p>
            </footer>
        </div>
    );
}
