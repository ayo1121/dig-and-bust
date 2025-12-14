'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';


interface AuthUser {
    id: string;
    displayName: string;
    type: 'email' | 'guest' | 'wallet';
    email?: string;
    walletAddress?: string;
}

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    signInWithEmail: (email: string) => Promise<void>;
    signInAsGuest: (username: string) => void;
    signInWithWallet: (walletAddress: string, username?: string) => void;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_STORAGE_KEY = 'dig_bust_guest';
const WALLET_STORAGE_KEY = 'dig_bust_wallet';

function generateGuestId(): string {
    return 'guest_' + Math.random().toString(36).substring(2, 15);
}

function shortenWalletAddress(address: string): string {
    return address.slice(0, 4) + '...' + address.slice(-4);
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session
        const initAuth = async () => {
            try {
                // Check Supabase auth first
                const { data: { session } } = await supabase.auth.getSession();

                if (session?.user) {
                    setUser({
                        id: session.user.id,
                        displayName: session.user.email?.split('@')[0] || 'Player',
                        type: 'email',
                        email: session.user.email,
                    });
                    setLoading(false);
                    return;
                }

                // Check for wallet session
                const walletData = localStorage.getItem(WALLET_STORAGE_KEY);
                if (walletData) {
                    const parsed = JSON.parse(walletData);
                    setUser({
                        id: parsed.address,
                        displayName: parsed.username || shortenWalletAddress(parsed.address),
                        type: 'wallet',
                        walletAddress: parsed.address,
                    });
                    setLoading(false);
                    return;
                }

                // Check for guest session
                const guestData = localStorage.getItem(GUEST_STORAGE_KEY);
                if (guestData) {
                    const parsed = JSON.parse(guestData);
                    setUser({
                        id: parsed.id,
                        displayName: parsed.username,
                        type: 'guest',
                    });
                    setLoading(false);
                    return;
                }

                setLoading(false);
            } catch (error) {
                console.error('Auth init error:', error);
                setLoading(false);
            }
        };

        initAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_IN' && session?.user) {
                    setUser({
                        id: session.user.id,
                        displayName: session.user.email?.split('@')[0] || 'Player',
                        type: 'email',
                        email: session.user.email,
                    });
                } else if (event === 'SIGNED_OUT') {
                    // Only clear if current user is email type
                    if (user?.type === 'email') {
                        setUser(null);
                    }
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const signInWithEmail = async (email: string) => {
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: typeof window !== 'undefined'
                    ? `${window.location.origin}/play`
                    : undefined,
            },
        });
        if (error) throw error;
    };

    const signInAsGuest = (username: string) => {
        const guestId = generateGuestId();
        const guestData = { id: guestId, username };
        localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(guestData));
        setUser({
            id: guestId,
            displayName: username,
            type: 'guest',
        });
    };

    const signInWithWallet = (walletAddress: string, username?: string) => {
        const walletData = { address: walletAddress, username };
        localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(walletData));
        setUser({
            id: walletAddress,
            displayName: username || shortenWalletAddress(walletAddress),
            type: 'wallet',
            walletAddress,
        });
    };

    const signOut = async () => {
        if (user?.type === 'email') {
            await supabase.auth.signOut();
        }
        localStorage.removeItem(GUEST_STORAGE_KEY);
        localStorage.removeItem(WALLET_STORAGE_KEY);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                signInWithEmail,
                signInAsGuest,
                signInWithWallet,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
