'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
  variationId?: string;
  variationName?: string;
  stock: number;
}

interface CartContextData {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemsCount: number;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Carregar carrinho do localStorage
  useEffect(() => {
    setMounted(true);
    const savedCart = localStorage.getItem('@thebeautypro:cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Salvar carrinho no localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('@thebeautypro:cart', JSON.stringify(items));
    }
  }, [items, mounted]);

  const addItem = (newItem: Omit<CartItem, 'id'>) => {
    setItems((prevItems) => {
      // Verificar se o item já existe no carrinho
      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item.productId === newItem.productId &&
          item.variationId === newItem.variationId
      );

      if (existingItemIndex >= 0) {
        // Se já existe, incrementar quantidade
        const updatedItems = [...prevItems];
        const newQuantity = updatedItems[existingItemIndex].quantity + newItem.quantity;

        // Não permitir adicionar mais que o estoque
        updatedItems[existingItemIndex].quantity = Math.min(
          newQuantity,
          newItem.stock
        );

        return updatedItems;
      } else {
        // Se não existe, adicionar novo item
        return [
          ...prevItems,
          {
            ...newItem,
            id: `${newItem.productId}-${newItem.variationId || 'default'}-${Date.now()}`,
          },
        ];
      }
    });
  };

  const removeItem = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.min(Math.max(1, quantity), item.stock) }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
