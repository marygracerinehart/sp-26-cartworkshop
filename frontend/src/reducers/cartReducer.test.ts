import { describe, expect, it } from 'vitest';
import { cartReducer, initialCartState } from './cartReducer';

describe('cartReducer (pure function)', () => {
  it('increments quantity when adding the same product twice', () => {
    const once = cartReducer(initialCartState, {
      type: 'ADD_TO_CART',
      payload: {
        productId: 7,
        productName: 'Keyboard',
        price: 89.99,
      },
    });

    const twice = cartReducer(once, {
      type: 'ADD_TO_CART',
      payload: {
        productId: 7,
        productName: 'Keyboard',
        price: 89.99,
      },
    });

    expect(once.items).toHaveLength(1);
    expect(once.items[0].quantity).toBe(1);
    expect(twice.items).toHaveLength(1);
    expect(twice.items[0].quantity).toBe(2);
  });
});
