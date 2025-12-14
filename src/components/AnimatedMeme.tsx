'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface AnimatedMemeProps {
    isDigging?: boolean;
    progress?: number; // 0-100, how close to diamond wall
    showGaveUp?: boolean;
}

export default function AnimatedMeme({ isDigging = false, progress = 0, showGaveUp = false }: AnimatedMemeProps) {
    const [pickaxeAngle, setPickaxeAngle] = useState(0);
    const [minerX, setMinerX] = useState(0);
    const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);

    // Animate pickaxe when digging
    useEffect(() => {
        if (isDigging) {
            const interval = setInterval(() => {
                setPickaxeAngle(prev => (prev === 0 ? -30 : 0));
            }, 150);

            // Add sparkle effect
            const sparkleId = Date.now();
            setSparkles(prev => [...prev, { id: sparkleId, x: Math.random() * 20, y: Math.random() * 20 }]);
            setTimeout(() => {
                setSparkles(prev => prev.filter(s => s.id !== sparkleId));
            }, 500);

            return () => clearInterval(interval);
        } else {
            setPickaxeAngle(0);
        }
    }, [isDigging]);

    // Move miner forward based on progress
    useEffect(() => {
        setMinerX(progress * 0.5); // Move slightly right as progress increases
    }, [progress]);

    return (
        <div className="relative w-full max-w-2xl mx-auto select-none">
            {/* Main container with meme-style layout */}
            <div className="relative bg-gradient-to-b from-[#f5e6d3] to-[#e8d5c4] rounded-2xl overflow-hidden shadow-2xl border-4 border-[#8B6914]">

                {/* Top panel - "Gave up" scenario */}
                <div className={`relative h-32 sm:h-40 overflow-hidden transition-opacity duration-500 ${showGaveUp ? 'opacity-100' : 'opacity-60'}`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#f5e6d3] via-[#8B6914] to-[#4a3a1a]">
                        {/* Tunnel opening */}
                        <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-[#f5e6d3]" />

                        {/* Dirt/rock texture */}
                        <div className="absolute left-1/3 top-0 bottom-0 right-1/4 bg-gradient-to-r from-[#6d5a3a] via-[#5c4a2a] to-[#4a3a1a]">
                            {/* Rock patterns */}
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute rounded-full bg-[#3d2e1a] opacity-40"
                                    style={{
                                        width: `${20 + Math.random() * 30}px`,
                                        height: `${15 + Math.random() * 25}px`,
                                        left: `${10 + i * 12}%`,
                                        top: `${20 + (i % 3) * 25}%`,
                                    }}
                                />
                            ))}
                        </div>

                        {/* Diamond wall (close!) */}
                        <div className="absolute right-0 top-0 bottom-0 w-1/4 bg-gradient-to-l from-[#4fc3f7] via-[#81d4fa] to-[#4a3a1a]">
                            {[...Array(6)].map((_, i) => (
                                <span
                                    key={i}
                                    className="absolute text-2xl sm:text-3xl"
                                    style={{
                                        right: `${5 + (i % 2) * 15}%`,
                                        top: `${15 + i * 14}%`,
                                    }}
                                >
                                    💎
                                </span>
                            ))}
                        </div>

                        {/* Sad miner walking away */}
                        <div className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 transform scale-x-[-1]">
                            <div className="relative">
                                <span className="text-4xl sm:text-5xl">😢</span>
                                <span className="absolute -top-2 -right-4 text-2xl sm:text-3xl rotate-45">⛏️</span>
                            </div>
                        </div>
                    </div>

                    {/* Label */}
                    <div className="absolute bottom-2 left-4 bg-red-600/90 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
                        GAVE UP ❌
                    </div>
                </div>

                {/* Divider */}
                <div className="h-2 bg-gradient-to-r from-[#8B6914] via-[#a67c52] to-[#8B6914]" />

                {/* Bottom panel - "Keep digging" scenario (animated) */}
                <div className={`relative h-40 sm:h-52 overflow-hidden transition-all duration-300 ${!showGaveUp ? 'ring-4 ring-amber-400 ring-inset' : ''}`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#f5e6d3] via-[#8B6914] to-[#4a3a1a]">
                        {/* Tunnel opening */}
                        <div className="absolute left-0 top-0 bottom-0 w-1/4 bg-[#f5e6d3]" />

                        {/* Dirt/rock texture - gets smaller as progress increases */}
                        <div
                            className="absolute top-0 bottom-0 bg-gradient-to-r from-[#6d5a3a] via-[#5c4a2a] to-[#4a3a1a] transition-all duration-500"
                            style={{
                                left: '25%',
                                right: `${15 + progress * 0.1}%`,
                            }}
                        >
                            {/* Rock patterns */}
                            {[...Array(10)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute rounded-full bg-[#3d2e1a] opacity-50"
                                    style={{
                                        width: `${15 + Math.random() * 25}px`,
                                        height: `${10 + Math.random() * 20}px`,
                                        left: `${5 + i * 10}%`,
                                        top: `${15 + (i % 4) * 20}%`,
                                    }}
                                />
                            ))}

                            {/* Dig impact sparkles */}
                            {sparkles.map(sparkle => (
                                <div
                                    key={sparkle.id}
                                    className="absolute animate-ping"
                                    style={{
                                        right: `${10 + sparkle.x}%`,
                                        top: `${40 + sparkle.y}%`,
                                    }}
                                >
                                    <span className="text-yellow-300 text-lg">✨</span>
                                </div>
                            ))}
                        </div>

                        {/* Diamond wall - gets more visible as progress increases */}
                        <div
                            className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-[#4fc3f7] via-[#81d4fa] to-transparent transition-all duration-500"
                            style={{
                                width: `${15 + progress * 0.15}%`,
                                opacity: 0.5 + progress * 0.005,
                            }}
                        >
                            {[...Array(8)].map((_, i) => (
                                <span
                                    key={i}
                                    className={`absolute text-2xl sm:text-4xl transition-all duration-500 ${progress > 50 ? 'animate-pulse' : ''}`}
                                    style={{
                                        right: `${5 + (i % 3) * 20}%`,
                                        top: `${10 + i * 11}%`,
                                        opacity: 0.6 + progress * 0.004,
                                    }}
                                >
                                    💎
                                </span>
                            ))}
                        </div>

                        {/* Animated Miner */}
                        <div
                            className="absolute top-1/2 -translate-y-1/2 transition-all duration-300"
                            style={{
                                left: `${20 + minerX}%`,
                            }}
                        >
                            <div className={`relative ${isDigging ? 'animate-bounce' : ''}`}>
                                {/* Miner body */}
                                <span className="text-4xl sm:text-6xl">💪</span>

                                {/* Animated pickaxe */}
                                <span
                                    className="absolute -top-4 sm:-top-6 left-6 sm:left-10 text-3xl sm:text-5xl transition-transform duration-150 origin-bottom-left"
                                    style={{
                                        transform: `rotate(${pickaxeAngle}deg)`,
                                    }}
                                >
                                    ⛏️
                                </span>

                                {/* Determination face */}
                                <span className="absolute -top-8 sm:-top-10 left-0 text-2xl sm:text-3xl">
                                    {isDigging ? '😤' : '😊'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Label */}
                    <div className={`absolute bottom-2 left-4 px-3 py-1 rounded-full text-xs sm:text-sm font-bold transition-colors ${isDigging
                            ? 'bg-amber-500 text-white animate-pulse'
                            : 'bg-green-600/90 text-white'
                        }`}>
                        {isDigging ? 'DIGGING... ⛏️' : 'KEEP DIGGING! 💪'}
                    </div>

                    {/* Progress indicator */}
                    {progress > 0 && (
                        <div className="absolute bottom-2 right-4 bg-diamond/90 text-tunnel-bg px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
                            {progress.toFixed(0)}% to 💎
                        </div>
                    )}
                </div>
            </div>

            {/* Motivational text */}
            <div className="text-center mt-4">
                <p className={`text-lg sm:text-xl font-bold transition-colors ${progress >= 75 ? 'text-diamond animate-pulse' :
                        progress >= 50 ? 'text-amber-400' :
                            'text-white'
                    }`}>
                    {showGaveUp ? "Don't be like this guy! 👆" :
                        progress >= 75 ? "SO CLOSE! DON'T GIVE UP!" :
                            progress >= 50 ? "You're getting there!" :
                                progress > 0 ? "Keep going!" :
                                    "Click to start digging!"}
                </p>
            </div>
        </div>
    );
}
