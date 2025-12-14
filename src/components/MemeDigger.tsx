'use client';

import Image from 'next/image';

interface MemeDiggerProps {
    isDigging: boolean;
    progress: number; // 0-100
    showBust: boolean;
}

export default function MemeDigger({ isDigging, progress, showBust }: MemeDiggerProps) {
    return (
        <div className="relative w-full max-w-2xl mx-auto">
            {/* Container with perspective for 3D effect */}
            <div className="relative overflow-hidden rounded-2xl shadow-2xl border-4 border-amber-700">

                {/* The actual meme image */}
                <div className={`relative transition-transform duration-200 ${isDigging ? 'animate-meme-shake' : ''}`}>
                    <Image
                        src="/meme.png"
                        alt="Keep digging meme"
                        width={600}
                        height={520}
                        className="w-full h-auto"
                        priority
                    />

                    {/* Overlay effects for digging animation */}
                    {isDigging && (
                        <>
                            {/* Dust particles flying */}
                            <div className="absolute top-1/2 right-1/4 animate-dust-1">
                                <span className="text-2xl">💨</span>
                            </div>
                            <div className="absolute top-[55%] right-[30%] animate-dust-2">
                                <span className="text-xl">💥</span>
                            </div>
                            <div className="absolute top-[45%] right-[28%] animate-dust-3">
                                <span className="text-lg">✨</span>
                            </div>

                            {/* Rock fragments */}
                            <div className="absolute top-1/2 right-1/3 animate-rock-fly-1">
                                <div className="w-3 h-3 bg-amber-800 rounded-full" />
                            </div>
                            <div className="absolute top-[48%] right-[35%] animate-rock-fly-2">
                                <div className="w-2 h-2 bg-amber-700 rounded-full" />
                            </div>
                        </>
                    )}

                    {/* Progress indicator overlay - shows how close to diamonds */}
                    {progress > 30 && (
                        <div className="absolute bottom-4 right-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-full font-bold text-sm animate-pulse shadow-lg">
                            💎 {Math.round(progress)}% to Diamond Wall!
                        </div>
                    )}

                    {/* "You are here" indicator on bottom panel */}
                    <div
                        className="absolute bottom-[25%] transition-all duration-500 pointer-events-none"
                        style={{ left: `${15 + (progress * 0.35)}%` }}
                    >
                        <div className="animate-bounce">
                            <span className="text-2xl">👇</span>
                        </div>
                    </div>

                    {/* Bust overlay */}
                    {showBust && (
                        <div className="absolute inset-0 bg-red-900/60 flex items-center justify-center animate-fade-in">
                            <div className="text-center">
                                <div className="text-6xl mb-4">💀</div>
                                <div className="text-4xl font-bold text-white drop-shadow-lg">
                                    YOU GAVE UP!
                                </div>
                                <div className="text-xl text-white/80 mt-2">
                                    You were SO close...
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Highlight box on bottom panel (the guy still digging) */}
                <div className={`absolute bottom-0 left-0 right-0 h-1/2 border-t-4 transition-colors ${showBust ? 'border-red-500' : 'border-green-500'
                    }`}>
                    {!showBust && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 text-xs font-bold rounded-full animate-pulse">
                            BE LIKE THIS GUY! 💪
                        </div>
                    )}
                </div>

                {/* Top panel gets X when you bust */}
                <div className="absolute top-0 left-0 right-0 h-1/2">
                    {showBust && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 text-xs font-bold rounded-full">
                            DON'T BE THIS GUY ❌
                        </div>
                    )}
                    {!showBust && (
                        <div className="absolute top-2 left-2 bg-gray-700/80 text-white px-3 py-1 text-xs font-bold rounded-full">
                            💀 Gave Up Too Soon
                        </div>
                    )}
                </div>
            </div>

            {/* Motivation text */}
            <div className="text-center mt-4">
                <p className={`text-xl font-bold ${progress >= 75 ? 'text-cyan-400 animate-pulse' :
                        progress >= 50 ? 'text-amber-400' :
                            'text-white'
                    }`}>
                    {showBust ? "Don't give up next time! Try again!" :
                        progress >= 75 ? "🔥 SO CLOSE! ONE MORE DIG!" :
                            progress >= 50 ? "💎 You can see the diamonds!" :
                                progress > 0 ? "⛏️ Keep digging!" :
                                    "Click DIG to start mining!"}
                </p>
            </div>
        </div>
    );
}
