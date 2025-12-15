'use client';

import { useEffect, useState } from 'react';

interface MemeDiggerProps {
    isDigging: boolean;
    progress: number;
    showBust: boolean;
}

export default function MemeDigger({ isDigging, progress, showBust }: MemeDiggerProps) {
    const [shaking, setShaking] = useState(false);

    useEffect(() => {
        if (isDigging) {
            setShaking(true);
            const timer = setTimeout(() => setShaking(false), 250);
            return () => clearTimeout(timer);
        }
    }, [isDigging, progress]);

    return (
        <div className="w-full max-w-xl mx-auto">
            <div className="card overflow-hidden rounded-2xl">

                {/* TOP PANEL ONLY - active mining */}
                {!showBust && (
                    <div
                        className={`relative overflow-hidden ${shaking ? 'animate-meme-shake' : ''}`}
                        style={{
                            height: '260px',
                            aspectRatio: '16/9'
                        }}
                    >
                        <div
                            className="absolute inset-0 bg-no-repeat"
                            style={{
                                backgroundImage: 'url(/meme.png)',
                                backgroundPosition: 'center top',
                                backgroundSize: '100% auto',
                            }}
                        />

                        {/* Progress badge */}
                        <div className="absolute bottom-3 right-3 bg-dark-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium border border-dark-600/50">
                            💎 {Math.round(progress)}%
                        </div>

                        {/* Status badge */}
                        <div className="absolute top-3 left-3 bg-emerald-500/90 backdrop-blur-sm text-white px-3 py-1.5 text-xs font-semibold rounded-full">
                            Keep digging!
                        </div>

                        {/* Dig effects */}
                        {isDigging && (
                            <div className="absolute top-1/2 right-8 flex gap-1">
                                <span className="animate-dust-1 text-2xl">💥</span>
                                <span className="animate-dust-2 text-xl">✨</span>
                                <span className="animate-dust-3 text-lg">💨</span>
                            </div>
                        )}
                    </div>
                )}

                {/* BOTTOM PANEL ONLY - gave up */}
                {showBust && (
                    <div
                        className="relative overflow-hidden"
                        style={{
                            height: '260px',
                            aspectRatio: '16/9'
                        }}
                    >
                        <div
                            className="absolute inset-0 bg-no-repeat"
                            style={{
                                backgroundImage: 'url(/meme.png)',
                                backgroundPosition: 'center bottom',
                                backgroundSize: '100% auto',
                            }}
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/95 via-dark-900/50 to-transparent flex flex-col items-center justify-end pb-6">
                            <p className="text-3xl mb-2">😢</p>
                            <p className="text-xl font-bold text-white">You gave up!</p>
                            <p className="text-sm text-dark-300 mt-1">So close to the diamonds...</p>
                        </div>

                        {/* Warning badge */}
                        <div className="absolute top-3 left-3 bg-danger/90 backdrop-blur-sm text-white px-3 py-1.5 text-xs font-semibold rounded-full">
                            Don't be this guy
                        </div>
                    </div>
                )}
            </div>

            {/* Motivation */}
            <p className={`text-center mt-4 text-sm font-medium ${showBust ? 'text-dark-400' :
                    progress >= 75 ? 'text-secondary-400' :
                        progress >= 50 ? 'text-primary-400' :
                            'text-dark-400'
                }`}>
                {showBust
                    ? "Never give up! Try again."
                    : progress >= 75
                        ? "🔥 Almost there!"
                        : progress >= 50
                            ? "💎 Diamonds are close!"
                            : "⛏️ Keep going!"}
            </p>
        </div>
    );
}
