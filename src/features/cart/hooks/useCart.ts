import { useState, useEffect, useCallback } from 'react';
import { cartService } from '@/shared/services/cartService';
import { CartItem, CartSummary } from '@/shared/types/game';

interface UseCartResult {
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  error: string | null;
  addToCart: (game: any) => void;
  removeFromCart: (gameId: string) => void;
  updateCartItemQuantity: (gameId: string, quantity: number) => void;
  clearCart: () => void;
  refreshCart: () => void;
  setError: (error: string | null) => void;
}

export const useCart = (): UseCartResult => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCart = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [items, summary] = await Promise.all([
        process.env.NODE_ENV === 'test'
          ? Promise.resolve(cartService.getCartItems())
          : new Promise<CartItem[]>(resolve => {
              setTimeout(() => {
                resolve(cartService.getCartItems());
              }, 0);
            }),
        process.env.NODE_ENV === 'test'
          ? Promise.resolve(cartService.getCartSummary())
          : new Promise<CartSummary>(resolve => {
              setTimeout(() => {
                resolve(cartService.getCartSummary());
              }, 0);
            })
      ]);

      setCartItems(items);
      setTotalItems(summary.totalItems);
      setTotalPrice(summary.totalPrice);
    } catch (err) {
      setError('Error loading cart items.');
      console.error('Error loading cart items:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'game-cart') {
        loadCart();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadCart]);

  const addToCart = useCallback((game: any) => {
    try {
      cartService.addToCart(game);
      loadCart();
    } catch (err) {
      setError('Error adding to cart.');
      console.error('Error adding to cart:', err);
    }
  }, [loadCart]);

  const removeFromCart = useCallback((gameId: string) => {
    try {
      cartService.removeFromCart(gameId);
      loadCart();
    } catch (err) {
      setError('Error removing from cart.');
      console.error('Error removing from cart:', err);
    }
  }, [loadCart]);

  const updateCartItemQuantity = useCallback((gameId: string, quantity: number) => {
    try {
      cartService.updateQuantity(gameId, quantity);
      loadCart();
    } catch (err) {
      setError('Error updating item quantity.');
      console.error('Error updating item quantity:', err);
    }
  }, [loadCart]);

  const clearCart = useCallback(() => {
    try {
      cartService.clearCart();
      loadCart();
    } catch (err) {
      setError('Error clearing cart.');
      console.error('Error clearing cart:', err);
    }
  }, [loadCart]);

  const refreshCart = useCallback(() => {
    loadCart();
  }, [loadCart]);

  return {
    cartItems,
    totalItems,
    totalPrice,
    isLoading,
    error,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    refreshCart,
    setError,
  };
};
