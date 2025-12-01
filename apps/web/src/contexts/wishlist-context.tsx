'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface WishlistItem {
  id: string;
  productId: string;
  createdAt: string;
}

interface WishlistContextType {
  wishlistItems: string[]; // Array of product IDs
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch wishlist when user logs in
  useEffect(() => {
    if (status === 'authenticated') {
      fetchWishlist();
    } else if (status === 'unauthenticated') {
      setWishlistItems([]);
    }
  }, [status]);

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist');
      if (response.ok) {
        const data = await response.json();
        const productIds = data.map((item: WishlistItem) => item.productId);
        setWishlistItems(productIds);
      }
    } catch (error) {
      console.error('Erro ao buscar wishlist:', error);
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.includes(productId);
  };

  const addToWishlist = async (productId: string) => {
    if (!session) {
      toast.error('Faça login para adicionar produtos à sua lista de desejos');
      return;
    }

    if (isInWishlist(productId)) {
      return; // Already in wishlist
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar à wishlist');
      }

      setWishlistItems([...wishlistItems, productId]);
      toast.success('Adicionado à lista de desejos');
    } catch (error: any) {
      console.error('Erro ao adicionar à wishlist:', error);
      toast.error(error.message || 'Erro ao adicionar à wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao remover da wishlist');
      }

      setWishlistItems(wishlistItems.filter((id) => id !== productId));
      toast.success('Removido da lista de desejos');
    } catch (error: any) {
      console.error('Erro ao remover da wishlist:', error);
      toast.error(error.message || 'Erro ao remover da wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWishlist = async (productId: string) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isLoading,
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
