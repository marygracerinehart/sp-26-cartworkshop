import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CartProvider, useCartContext } from './CartContext';

function CartProbe() {
  const { cartItemCount, cartTotal, dispatch } = useCartContext();

  return (
    <div>
      <p aria-label="item-count">{cartItemCount}</p>
      <p aria-label="cart-total">{cartTotal.toFixed(2)}</p>
      <button
        type="button"
        aria-label="add-item"
        onClick={() =>
          dispatch({
            type: 'ADD_TO_CART',
            payload: {
              productId: 11,
              productName: 'Test Product',
              price: 12.5,
            },
          })
        }
      >
        Add
      </button>
    </div>
  );
}

describe('CartProvider context', () => {
  it('updates cartItemCount and cartTotal after dispatch', () => {
    render(
      <CartProvider>
        <CartProbe />
      </CartProvider>
    );

    expect(screen.getByLabelText('item-count')).toHaveTextContent('0');
    expect(screen.getByLabelText('cart-total')).toHaveTextContent('0.00');

    fireEvent.click(screen.getByRole('button', { name: 'add-item' }));

    expect(screen.getByLabelText('item-count')).toHaveTextContent('1');
    expect(screen.getByLabelText('cart-total')).toHaveTextContent('12.50');
  });
});
