'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface MemeDiggerProps {
    isDigging: boolean;
    progress: number; // 0-100
    showBust: boolean;
}

export default function MemeDigger({ isDigging, progress, showBust }: MemeDiggerProps) {
    const [shaking, setShaking] = useState(false);

    // Trigger shake animation on each dig
    useEffect(() => {
        if (isDigging) {
            setShaking(true);
            const timer = setTimeout(() => setShaking(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isDigging, progress]); // progress change means a new dig happened

    // Calculate how much to "zoom in" on the top panel to simulate getting closer
    // As progress increases, we crop more of the left side to show miner closer to diamonds
    const cropAmount = progress * 0.3; // 0 to 30% crop from left

    return (
        <div className="relative w-full max-w-2xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl border-4 border-amber-700 bg-[#f5e6d3]">

                {/* Show TOP panel while playing (guy actively digging toward diamonds) */}
                {!showBust && (
                    <div
                        className={`relative overflow-hidden transition-transform duration-150 ${shaking ? 'animate-meme-shake' : ''}`}
                        style={{ height: '260px' }}
                    >
                        {/* Crop the meme to show only the TOP portion, and pan right as progress increases */}
                        <div
                            className="absolute transition-all duration-500 ease-out"
                            style={{
                                top: '0',
                                left: `-${cropAmount}%`,
                                width: `${100 + cropAmount}%`,
                            }}
                        >
                            <Image
                                src="/meme.png"
                                alt="Keep digging meme"
                                width={700}
                                height={608}
                                className="w-full h-auto"
                                style={{
                                    objectFit: 'cover',
                                    objectPosition: 'top',
                                    maxHeight: '260px',
                                }}
                                priority
                            />
                        </div>

                        {/* Progress overlay */}
                        <div className="absolute bottom-3 right-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                            💎 {Math.round(progress)}% closer!
                        </div>

                        {/* "Keep going" label */}
                        <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg">
                            ⛏️ KEEP DIGGING!
                        </div>

                        {/* Dust/impact effects when digging */}
                        {isDigging && (
                            <div className="absolute top-1/2 right-8 flex gap-2">
                                <span className="animate-dust-1 text-2xl">💥</span>
                                <span className="animate-dust-2 text-xl">✨</span>
                                <span className="animate-dust-3 text-lg">💨</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Show BOTTOM panel when player loses (guy walking away = gave up) */}
                {showBust && (
                    <div className="relative" style={{ height: '280px' }}>
                        {/* Crop the meme to show only the BOTTOM portion */}
                        <div className="absolute overflow-hidden" style={{
                            bottom: '0',
                            left: '0',
                            right: '0',
                            height: '280px'
                        }}>
                            <Image
                                src="/meme.png"
                                alt="Gave up meme"
                                width={700}
                                height={608}
                                className="w-full"
                                style={{
                                    objectFit: 'cover',
                                    objectPosition: 'bottom',
                                    marginTop: '-280px',
                                }}
                                priority
                            />
                        </div>

                        {/* "Gave up" overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-red-900/80 to-transparent flex flex-col items-center justify-end pb-6">
                            <div className="text-4xl mb-2">😢</div>
                            <div className="text-2xl font-bold text-white drop-shadow-lg">
                                YOU GAVE UP!
                            </div>
                            <div className="text-sm text-white/80 mt-1">
                                You were SO close to the diamonds...
                            </div>
                        </div>

                        {/* Warning label */}
                        <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 text-xs font-bold rounded-full">
                            ❌ DON'T BE THIS GUY
                        </div>
                    </div>
                )}
            </div>

            {/* Motivational message */}
            <div className="text-center mt-4">
                <p className={`text-xl font-bold ${showBust ? 'text-red-400' :
                        progress >= 75 ? 'text-cyan-400 animate-pulse' :
                            progress >= 50 ? 'text-amber-400' :
                                'text-white'
                    }`}>
                    {showBust
                        ? "Never give up! Try again!"
                        : progress >= 75
                            ? "🔥 SO CLOSE! DON'T STOP!"
                            : progress >= 50
                                ? "💎 Diamonds are getting closer!"
                                : "⛏️ Keep digging toward the diamonds!"}
                </p>
            </div>
        </div>
    );
}
