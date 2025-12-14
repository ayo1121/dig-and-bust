'use client';

import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiProps {
    trigger: boolean;
    type?: 'jackpot' | 'gem';
}

export default function Confetti({ trigger, type = 'jackpot' }: ConfettiProps) {
    const hasTriggered = useRef(false);

    useEffect(() => {
        if (trigger && !hasTriggered.current) {
            hasTriggered.current = true;

            if (type === 'jackpot') {
                // Big celebration for jackpot
                const duration = 3000;
                const end = Date.now() + duration;

                const colors = ['#4fc3f7', '#81d4fa', '#ffd700', '#ff9800'];

                (function frame() {
                    confetti({
                        particleCount: 4,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0 },
                        colors,
                    });
                    confetti({
                        particleCount: 4,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1 },
                        colors,
                    });

                    if (Date.now() < end) {
                        requestAnimationFrame(frame);
                    }
                })();

                // Diamond burst from center
                setTimeout(() => {
                    confetti({
                        particleCount: 100,
                        spread: 100,
                        origin: { y: 0.5 },
                        colors: ['#4fc3f7', '#00bcd4', '#ffffff'],
                        shapes: ['circle'],
                        scalar: 1.5,
                    });
                }, 500);
            } else {
                // Small pop for gem
                confetti({
                    particleCount: 20,
                    spread: 40,
                    origin: { y: 0.6 },
                    colors: ['#4fc3f7', '#ffd700'],
                    scalar: 0.8,
                });
            }
        }

        // Reset trigger tracking when trigger becomes false
        if (!trigger) {
            hasTriggered.current = false;
        }
    }, [trigger, type]);

    return null;
}
