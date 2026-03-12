import { Link, Outlet } from "react-router-dom";
import styles from "./Layout.module.css";
import { CartBadge } from "./CartBadge/CartBadge";

export default function Layout() {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>🌰</span>
            <h1 className={styles.title}>Buckeye Marketplace</h1>
          </Link>
          <Link to="/cart" aria-label="Go to cart">
            <CartBadge />
          </Link>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
