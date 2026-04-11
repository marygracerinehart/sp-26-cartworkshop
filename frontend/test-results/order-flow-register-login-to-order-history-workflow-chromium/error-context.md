# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: order-flow.spec.ts >> register/login to order-history workflow
- Location: tests/e2e/order-flow.spec.ts:3:1

# Error details

```
Error: Login/register UI not found. The route currently renders blank and blocks the full E2E workflow.

expect(locator).toBeVisible() failed

Locator: getByRole('form', { name: /log in|login|register|sign in|sign up/i }).or(getByLabel(/email/i)).or(getByLabel(/password/i))
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Login/register UI not found. The route currently renders blank and blocks the full E2E workflow. with timeout 5000ms
  - waiting for getByRole('form', { name: /log in|login|register|sign in|sign up/i }).or(getByLabel(/email/i)).or(getByLabel(/password/i))

```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | test("register/login to order-history workflow", async ({ page }) => {
  4  |   await test.step("1) Register or log in with a valid user", async () => {
  5  |     await page.goto("/login");
  6  | 
  7  |     await expect(page, "Expected /login route to be available").toHaveURL(/\/login$/);
  8  | 
  9  |     const authForm = page.getByRole("form", { name: /log in|login|register|sign in|sign up/i });
  10 |     const emailInput = page.getByLabel(/email/i);
  11 |     const passwordInput = page.getByLabel(/password/i);
  12 | 
  13 |     await expect(
  14 |       authForm.or(emailInput).or(passwordInput),
  15 |       "Login/register UI not found. The route currently renders blank and blocks the full E2E workflow."
> 16 |     ).toBeVisible();
     |       ^ Error: Login/register UI not found. The route currently renders blank and blocks the full E2E workflow.
  17 |   });
  18 | 
  19 |   await test.step("2) Browse products", async () => {
  20 |     await page.goto("/");
  21 |     await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();
  22 |   });
  23 | 
  24 |   await test.step("3) Add an item to the cart", async () => {
  25 |     await page.getByRole("button", { name: /add .* to cart/i }).first().click();
  26 |     await expect(page.getByRole("button", { name: /shopping cart with 1 items/i })).toBeVisible();
  27 |   });
  28 | 
  29 |   await test.step("4) Go to checkout and place an order", async () => {
  30 |     await page.getByRole("link", { name: /go to cart/i }).click();
  31 |     await expect(page, "Expected checkout form route or section to exist").toHaveURL(/\/checkout|\/cart/);
  32 | 
  33 |     const placeOrderButton = page.getByRole("button", { name: /place order/i });
  34 |     await expect(placeOrderButton, "Place order action is not available on current cart page").toBeVisible();
  35 |     await placeOrderButton.click();
  36 |   });
  37 | 
  38 |   await test.step("5) Verify the order confirmation appears", async () => {
  39 |     await expect(page.getByRole("heading", { name: /order confirmation|thank you/i })).toBeVisible();
  40 |   });
  41 | 
  42 |   await test.step("6) Go to order history and verify the order is listed", async () => {
  43 |     await page.goto("/orders");
  44 |     await expect(page.getByRole("heading", { name: /order history|orders/i })).toBeVisible();
  45 |     await expect(page.getByText(/order #|total|placed on/i).first()).toBeVisible();
  46 |   });
  47 | });
  48 | 
```