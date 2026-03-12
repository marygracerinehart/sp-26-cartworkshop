import React from "react";
import { Link } from "react-router-dom";
import { useCartContext } from "../contexts/CartContext";
import styles from "./CartPage.module.css";
import { CheckoutForm } from "../components/CheckoutForm/CheckoutForm";

export default function CartPage() {
  const { state, dispatch, cartTotal } = useCartContext();
  const { items } = state;

  if (items.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <h2>Your cart is empty</h2>
        <Link to="/" className={styles.browseLink} aria-label="Browse products">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.cartPage}>
      <h2 className={styles.heading}>Shopping Cart</h2>
      <ul className={styles.cartList} aria-label="Cart items">
        {items.map(item => (
          <li key={item.productId} className={styles.cartItem}>
            <div className={styles.itemInfo}>
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.productName} className={styles.itemImage} />
              )}
              <span className={styles.itemName}>{item.productName}</span>
              <span className={styles.itemPrice}>${item.price.toFixed(2)}</span>
            </div>
            <div className={styles.quantityControls}>
              <button
                type="button"
                aria-label={`Decrease quantity of ${item.productName}`}
                className={styles.quantityButton}
                onClick={() =>
                  dispatch({
                    type: "UPDATE_QUANTITY",
                    payload: {
                      productId: item.productId,
                      quantity: Math.max(1, item.quantity - 1),
                    },
                  })
                }
                disabled={item.quantity === 1}
              >
                −
              </button>
              <span className={styles.quantity}>{item.quantity}</span>
              <button
                type="button"
                aria-label={`Increase quantity of ${item.productName}`}
                className={styles.quantityButton}
                onClick={() =>
                  dispatch({
                    type: "UPDATE_QUANTITY",
                    payload: {
                      productId: item.productId,
                      quantity: Math.min(99, item.quantity + 1),
                    },
                  })
                }
              >
                +
              </button>
            </div>
            <span className={styles.lineTotal}>
              ${(item.price * item.quantity).toFixed(2)}
            </span>
            <button
              type="button"
              aria-label={`Remove ${item.productName} from cart`}
              className={styles.removeButton}
              onClick={() =>
                dispatch({
                  type: "REMOVE_FROM_CART",
                  payload: { productId: item.productId },
                })
              }
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className={styles.cartSummary}>
        <span className={styles.cartTotalLabel}>Cart Total:</span>
        <span className={styles.cartTotal}>${cartTotal.toFixed(2)}</span>
      </div>
      <CheckoutForm />
    </div>
  );
}
