import { expect, test } from "@playwright/test";

test("register/login to order-history workflow", async ({ page }) => {
  await test.step("1) Register or log in with a valid user", async () => {
    await page.goto("/login");

    await expect(page, "Expected /login route to be available").toHaveURL(/\/login$/);

    const authForm = page.getByRole("form", { name: /log in|login|register|sign in|sign up/i });
    const emailInput = page.getByLabel(/email/i);
    const passwordInput = page.getByLabel(/password/i);

    await expect(
      authForm.or(emailInput).or(passwordInput),
      "Login/register UI not found. The route currently renders blank and blocks the full E2E workflow."
    ).toBeVisible();
  });

  await test.step("2) Browse products", async () => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();
  });

  await test.step("3) Add an item to the cart", async () => {
    await page.getByRole("button", { name: /add .* to cart/i }).first().click();
    await expect(page.getByRole("button", { name: /shopping cart with 1 items/i })).toBeVisible();
  });

  await test.step("4) Go to checkout and place an order", async () => {
    await page.getByRole("link", { name: /go to cart/i }).click();
    await expect(page, "Expected checkout form route or section to exist").toHaveURL(/\/checkout|\/cart/);

    const placeOrderButton = page.getByRole("button", { name: /place order/i });
    await expect(placeOrderButton, "Place order action is not available on current cart page").toBeVisible();
    await placeOrderButton.click();
  });

  await test.step("5) Verify the order confirmation appears", async () => {
    await expect(page.getByRole("heading", { name: /order confirmation|thank you/i })).toBeVisible();
  });

  await test.step("6) Go to order history and verify the order is listed", async () => {
    await page.goto("/orders");
    await expect(page.getByRole("heading", { name: /order history|orders/i })).toBeVisible();
    await expect(page.getByText(/order #|total|placed on/i).first()).toBeVisible();
  });
});
