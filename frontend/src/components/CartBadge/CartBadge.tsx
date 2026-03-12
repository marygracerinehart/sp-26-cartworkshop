import React from "react";
import { useCartContext } from "../../contexts/CartContext";
import styles from "./CartBadge.module.css";

export function CartBadge() {
  const { cartItemCount } = useCartContext();
  return (
    <button
      className={styles.cartButton}
      aria-label={`Shopping cart with ${cartItemCount} items`}
      type="button"
    >
      🛒{" "}
      {cartItemCount > 0 && (
        <span className={styles.badge}>{cartItemCount}</span>
      )}
    </button>
  );
}
