import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishlistService, type WishlistItem } from '@/services/wishlist.service';
import { useAuth } from './auth-context';

interface WishlistContextType {
    wishlistItems: WishlistItem[];
    addToWishlist: (productId: string) => Promise<void>;
    removeFromWishlist: (productId: string) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
    wishlistCount: number;
    refreshWishlist: () => Promise<void>;
    isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

    // Fetch wishlist when user logs in
    useEffect(() => {
        if (user) {
            refreshWishlist();
        } else {
            // Clear wishlist when user logs out
            setWishlistItems([]);
        }
    }, [user]);

    const refreshWishlist = async () => {
        if (!user) return;
        
        try {
            setIsLoading(true);
            const response = await wishlistService.getMyWishlist();
            setWishlistItems(response.items);
        } catch (error) {
            console.error('Failed to fetch wishlist:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const addToWishlist = async (productId: string) => {
        if (!user) {
            throw new Error('Please login to add items to wishlist');
        }

        try {
            await wishlistService.addToWishlist(productId);
            await refreshWishlist();
        } catch (error: any) {
            console.error('Failed to add to wishlist:', error);
            throw error;
        }
    };

    const removeFromWishlist = async (productId: string) => {
        if (!user) return;

        try {
            await wishlistService.removeFromWishlist(productId);
            await refreshWishlist();
        } catch (error) {
            console.error('Failed to remove from wishlist:', error);
            throw error;
        }
    };

    const isInWishlist = (productId: string) => {
        return wishlistItems.some(item => item.productId === productId);
    };

    const wishlistCount = wishlistItems.length;

    return (
        <WishlistContext.Provider 
            value={{ 
                wishlistItems, 
                addToWishlist, 
                removeFromWishlist, 
                isInWishlist, 
                wishlistCount,
                refreshWishlist,
                isLoading
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
