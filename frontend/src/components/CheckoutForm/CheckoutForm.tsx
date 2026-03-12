import React, { useState } from "react";
import { useCartContext } from "../../contexts/CartContext";
import styles from "./CheckoutForm.module.css";

const US_STATES = [
  { value: "", label: "Select state" },
  { value: "OH", label: "Ohio" },
  { value: "CA", label: "California" },
  { value: "NY", label: "New York" },
  { value: "TX", label: "Texas" },
  { value: "FL", label: "Florida" },
];

const initialForm = {
  fullName: "",
  email: "",
  address: "",
  city: "",
  state: "",
  zip: "",
};

type FormFields = keyof typeof initialForm;

type Errors = Partial<Record<FormFields, string>>;

export function CheckoutForm() {
  const { cartTotal, cartItemCount, dispatch } = useCartContext();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Set<FormFields>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  function validateField(name: FormFields, value: string): string {
    switch (name) {
      case "fullName":
        if (!value.trim()) return "Full Name is required.";
        if (value.trim().length < 2) return "Full Name must be at least 2 characters.";
        break;
      case "email":
        if (!value.trim()) return "Email is required.";
        if (!value.includes("@")) return "Email must contain @.";
        break;
      case "address":
        if (!value.trim()) return "Shipping Address is required.";
        if (value.trim().length < 5) return "Address must be at least 5 characters.";
        break;
      case "city":
        if (!value.trim()) return "City is required.";
        break;
      case "state":
        if (!value) return "State is required.";
        break;
      case "zip":
        if (!value.trim()) return "Zip Code is required.";
        if (!/^[0-9]{5}$/.test(value)) return "Zip Code must be 5 digits.";
        break;
    }
    return "";
  }

  function validateAll(): Errors {
    const newErrors: Errors = {};
    (Object.keys(form) as FormFields[]).forEach((field) => {
      const error = validateField(field, form[field]);
      if (error) newErrors[field] = error;
    });
    return newErrors;
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target as HTMLInputElement;
    setTouched((prev) => new Set(prev).add(name as FormFields));
    setErrors((prev) => ({ ...prev, [name]: validateField(name as FormFields, value) }));
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const allTouched = new Set<FormFields>(Object.keys(form) as FormFields[]);
    setTouched(allTouched);
    const newErrors = validateAll();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      dispatch({ type: "CLEAR_CART" });
    }, 1200);
  }

  return (
    <form
      id="checkout-form"
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
      aria-label="Checkout form"
    >
      <h3 className={styles.heading}>Checkout</h3>
      <div className={styles.fieldGroup}>
        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          value={form.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          minLength={2}
          required
          aria-invalid={!!errors.fullName && touched.has("fullName")}
          aria-describedby={errors.fullName && touched.has("fullName") ? "fullName-error" : undefined}
        />
        {errors.fullName && touched.has("fullName") && (
          <div className={styles.error} role="alert" id="fullName-error">
            {errors.fullName}
          </div>
        )}
      </div>
      <div className={styles.fieldGroup}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          aria-invalid={!!errors.email && touched.has("email")}
          aria-describedby={errors.email && touched.has("email") ? "email-error" : undefined}
        />
        {errors.email && touched.has("email") && (
          <div className={styles.error} role="alert" id="email-error">
            {errors.email}
          </div>
        )}
      </div>
      <div className={styles.fieldGroup}>
        <label htmlFor="address">Shipping Address</label>
        <input
          id="address"
          name="address"
          type="text"
          value={form.address}
          onChange={handleChange}
          onBlur={handleBlur}
          minLength={5}
          required
          aria-invalid={!!errors.address && touched.has("address")}
          aria-describedby={errors.address && touched.has("address") ? "address-error" : undefined}
        />
        {errors.address && touched.has("address") && (
          <div className={styles.error} role="alert" id="address-error">
            {errors.address}
          </div>
        )}
      </div>
      <div className={styles.fieldRow}>
        <div className={styles.fieldGroup}>
          <label htmlFor="city">City</label>
          <input
            id="city"
            name="city"
            type="text"
            value={form.city}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            aria-invalid={!!errors.city && touched.has("city")}
            aria-describedby={errors.city && touched.has("city") ? "city-error" : undefined}
          />
          {errors.city && touched.has("city") && (
            <div className={styles.error} role="alert" id="city-error">
              {errors.city}
            </div>
          )}
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="state">State</label>
          <select
            id="state"
            name="state"
            value={form.state}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            aria-invalid={!!errors.state && touched.has("state")}
            aria-describedby={errors.state && touched.has("state") ? "state-error" : undefined}
          >
            {US_STATES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          {errors.state && touched.has("state") && (
            <div className={styles.error} role="alert" id="state-error">
              {errors.state}
            </div>
          )}
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="zip">Zip Code</label>
          <input
            id="zip"
            name="zip"
            type="text"
            value={form.zip}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            inputMode="numeric"
            pattern="[0-9]{5}"
            aria-invalid={!!errors.zip && touched.has("zip")}
            aria-describedby={errors.zip && touched.has("zip") ? "zip-error" : undefined}
          />
          {errors.zip && touched.has("zip") && (
            <div className={styles.error} role="alert" id="zip-error">
              {errors.zip}
            </div>
          )}
        </div>
      </div>
      <div className={styles.summary}>
        <span>Order Total:</span>
        <span className={styles.total}>${cartTotal.toFixed(2)}</span>
      </div>
      <button
        type="submit"
        className={styles.submitButton}
        disabled={submitting || cartItemCount === 0}
        aria-disabled={submitting || cartItemCount === 0}
      >
        {submitting ? "Processing..." : "Place Order"}
      </button>
      {success && (
        <div className={styles.success} role="alert">
          Thank you for your order! Your cart has been cleared.
        </div>
      )}
    </form>
  );
}
