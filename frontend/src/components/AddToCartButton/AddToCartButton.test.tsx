import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AddToCartButton } from './AddToCartButton';

const dispatchMock = vi.fn();

vi.mock('../../contexts/CartContext', () => ({
  useCartContext: () => ({
    dispatch: dispatchMock,
  }),
}));

describe('AddToCartButton', () => {
  beforeEach(() => {
    dispatchMock.mockClear();
  });

  it('dispatches ADD_TO_CART with product payload on click', () => {
    render(
      <AddToCartButton
        product={{
          id: 5,
          name: 'Classic Hoodie',
          price: 49.99,
          imageUrl: 'https://example.com/hoodie.jpg',
        }}
      />
    );

    const button = screen.getByRole('button', { name: 'Add Classic Hoodie to cart' });
    fireEvent.click(button);

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'ADD_TO_CART',
      payload: {
        productId: 5,
        productName: 'Classic Hoodie',
        price: 49.99,
        imageUrl: 'https://example.com/hoodie.jpg',
      },
    });
    expect(screen.getByRole('button', { name: 'Add Classic Hoodie to cart' })).toHaveTextContent('Added!');
  });
});
