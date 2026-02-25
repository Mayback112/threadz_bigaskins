import React, { createContext, useContext, useState } from 'react';

export interface CartItem {
    product: any; // Accept both old and new product types
    variantId?: string; // UUID of selected variant for backend API
    quantity: number;
    size: string;
    color: string;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: any, quantity: number, size: string, color: string, variantId?: string) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    const addToCart = (product: any, quantity: number, size: string, color: string, variantId?: string) => {
        setItems((prevItems) => {
            const existingItem = prevItems.find(
                (item) => item.product.id === product.id && item.size === size && item.color === color
            );

            if (existingItem) {
                return prevItems.map((item) =>
                    item.product.id === product.id && item.size === size && item.color === color
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            return [...prevItems, { product, quantity, size, color, variantId }];
        });
    };

    const removeFromCart = (productId: string) => {
        setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const totalItems = items.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = items.reduce((total, item) => {
        const price = item.product.discountedPrice > 0 
            ? item.product.discountedPrice 
            : item.product.costPrice || item.product.price || 0;
        return total + price * item.quantity;
    }, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
