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
        <div className="w-full max-w-lg mx-auto">
            <div className={`card overflow-hidden rounded-2xl ${shaking ? 'animate-meme-shake' : ''}`}>

                {/* TOP HALF ONLY - while digging */}
                {!showBust && (
                    <div className="relative" style={{ height: '220px' }}>
                        {/* Image scaled to 200% height, only top half visible */}
                        <img
                            src="/meme.png"
                            alt="Keep digging"
                            className="absolute w-full"
                            style={{
                                height: '440px', // Double the container
                                top: '0',        // Align to top, so bottom half is hidden
                                objectFit: 'cover',
                                objectPosition: 'top center',
                            }}
                        />

                        {/* Progress badge */}
                        <div className="absolute bottom-3 right-3 bg-dark-900/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium border border-dark-700">
                            💎 {Math.round(progress)}%
                        </div>

                        {/* Status badge */}
                        <div className="absolute top-3 left-3 bg-emerald-500 text-white px-3 py-1.5 text-xs font-semibold rounded-full shadow-lg">
                            Keep digging!
                        </div>

                        {/* Dig effects */}
                        {isDigging && (
                            <div className="absolute top-1/2 right-8 flex gap-1">
                                <span className="animate-dust-1 text-2xl">💥</span>
                                <span className="animate-dust-2 text-xl">✨</span>
                            </div>
                        )}
                    </div>
                )}

                {/* BOTTOM HALF ONLY - on bust */}
                {showBust && (
                    <div className="relative" style={{ height: '220px' }}>
                        {/* Image positioned to show only bottom half */}
                        <img
                            src="/meme.png"
                            alt="Gave up"
                            className="absolute w-full"
                            style={{
                                height: '440px',   // Double the container
                                top: '-220px',     // Shift up to hide top half
                                objectFit: 'cover',
                                objectPosition: 'top center',
                            }}
                        />

                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-950/95 via-dark-900/60 to-transparent flex flex-col items-center justify-end pb-6">
                            <p className="text-3xl mb-2">😢</p>
                            <p className="text-xl font-bold text-white">You gave up!</p>
                            <p className="text-sm text-dark-400 mt-1">So close to the diamonds...</p>
                        </div>

                        {/* Warning badge */}
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1.5 text-xs font-semibold rounded-full shadow-lg">
                            Don't be this guy
                        </div>
                    </div>
                )}
            </div>

            {/* Motivation text */}
            <p className={`text-center mt-4 text-sm font-medium ${showBust ? 'text-dark-500' :
                    progress >= 75 ? 'text-secondary-400' :
                        progress >= 50 ? 'text-primary-400' :
                            'text-dark-500'
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
