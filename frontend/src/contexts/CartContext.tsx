import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import type { CartState, CartAction } from '../types/cart';
import { cartReducer, initialCartState } from '../reducers/cartReducer';

interface CartContextValue {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  cartItemCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  const cartItemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value: CartContextValue = {
    state,
    dispatch,
    cartItemCount,
    cartTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
}

export { CartContext };
