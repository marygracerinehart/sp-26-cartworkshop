import React, { useState } from 'react';
import { useCartContext } from '../../contexts/CartContext';
import styles from './AddToCartButton.module.css';

interface AddToCartButtonProps {
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
  };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { dispatch } = useCartContext();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        productId: product.id,
        productName: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
      },
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      className={styles.button}
      aria-label={`Add ${product.name} to cart`}
      onClick={handleAdd}
      type="button"
    >
      {added ? 'Added!' : 'Add to Cart'}
    </button>
  );
}
