'use client';

import { useState } from 'react';
import { useAuth } from './AuthProvider';

interface AuthModalProps {
    isOpen: boolean;
    onClose?: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const { signInWithEmail, signInAsGuest, signInWithWallet } = useAuth();
    const [mode, setMode] = useState<'select' | 'email' | 'guest'>('select');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setError('');
        try {
            await signInWithEmail(email);
            setEmailSent(true);
        } catch (err: any) {
            setError(err.message || 'Failed to send magic link');
        } finally {
            setLoading(false);
        }
    };

    const handleGuestSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) return;
        signInAsGuest(username.trim());
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-tunnel-bg border-2 border-dirt rounded-xl p-6 w-full max-w-md relative">
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white"
                    >
                        ✕
                    </button>
                )}

                <h2 className="text-2xl font-bold text-center mb-6 text-amber-400">
                    ⛏️ Enter the Mine
                </h2>

                {mode === 'select' && (
                    <div className="space-y-4">
                        <button
                            onClick={() => setMode('email')}
                            className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                        >
                            ✉️ Sign in with Email
                        </button>

                        <button
                            onClick={() => setMode('guest')}
                            className="w-full py-3 px-4 bg-gradient-to-r from-dirt to-dirt-dark hover:from-dirt-light hover:to-dirt text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                        >
                            👤 Play as Guest
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-600"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-tunnel-bg text-gray-400">or</span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                // Wallet connection would be handled by wallet adapter
                                // For now, simulate with a prompt
                                const address = prompt('Enter wallet address (for demo):');
                                if (address) {
                                    const customName = prompt('Enter display name (optional):');
                                    signInWithWallet(address, customName || undefined);
                                }
                            }}
                            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                        >
                            👛 Connect Solana Wallet
                        </button>
                    </div>
                )}

                {mode === 'email' && (
                    <>
                        {emailSent ? (
                            <div className="text-center space-y-4">
                                <div className="text-5xl">📧</div>
                                <p className="text-green-400 font-semibold">Magic link sent!</p>
                                <p className="text-gray-300 text-sm">
                                    Check your email and click the link to sign in.
                                </p>
                                <button
                                    onClick={() => { setEmailSent(false); setMode('select'); }}
                                    className="text-amber-400 hover:underline text-sm"
                                >
                                    ← Back to options
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleEmailSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-300 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="miner@example.com"
                                        className="w-full px-4 py-3 bg-tunnel-wall border border-dirt rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                                        required
                                    />
                                </div>

                                {error && (
                                    <p className="text-red-400 text-sm">{error}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 text-white rounded-lg font-semibold transition-all"
                                >
                                    {loading ? 'Sending...' : 'Send Magic Link'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setMode('select')}
                                    className="w-full text-gray-400 hover:text-white text-sm"
                                >
                                    ← Back to options
                                </button>
                            </form>
                        )}
                    </>
                )}

                {mode === 'guest' && (
                    <form onSubmit={handleGuestSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-300 mb-2">Choose a Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="DiamondHunter42"
                                maxLength={20}
                                className="w-full px-4 py-3 bg-tunnel-wall border border-dirt rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-gradient-to-r from-dirt to-dirt-dark hover:from-dirt-light hover:to-dirt text-white rounded-lg font-semibold transition-all"
                        >
                            Start Digging!
                        </button>

                        <button
                            type="button"
                            onClick={() => setMode('select')}
                            className="w-full text-gray-400 hover:text-white text-sm"
                        >
                            ← Back to options
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
