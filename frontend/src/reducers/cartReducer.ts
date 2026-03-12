import type { CartState, CartAction, CartItem } from '../types/cart';

export const initialCartState: CartState = {
  items: [],
  isOpen: false,
};

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { productId, productName, price, imageUrl } = action.payload;
      const existingItem = state.items.find(item => item.productId === productId);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      const newItem: CartItem = {
        productId,
        productName,
        price,
        quantity: 1,
        imageUrl,
      };
      return {
        ...state,
        items: [...state.items, newItem],
      };
    }
    case 'REMOVE_FROM_CART': {
      const { productId } = action.payload;
      return {
        ...state,
        items: state.items.filter(item => item.productId !== productId),
      };
    }
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity < 1) {
        return {
          ...state,
          items: state.items.filter(item => item.productId !== productId),
        };
      }
      return {
        ...state,
        items: state.items.map(item =>
          item.productId === productId
            ? { ...item, quantity }
            : item
        ),
      };
    }
    case 'CLEAR_CART': {
      return {
        ...state,
        items: [],
      };
    }
    case 'TOGGLE_CART': {
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    }
    // No default case — rely on TypeScript exhaustive checking
  }
}
