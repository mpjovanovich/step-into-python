import { expect, test } from "@playwright/test";

// Just login for now
test("complete exercise", async ({ page }) => {
  /* LOGIN FORM */
  await page.goto("/login/");

  const emailInput = page.getByLabel(/email/i);
  await expect(emailInput).toBeVisible();
  await emailInput.fill("dev@dev.com");

  const passwordInput = page.getByLabel(/password/i);
  await expect(passwordInput).toBeVisible();
  await passwordInput.fill("devUser");

  const loginButton = page.getByRole("button", { name: /sign in/i });
  await expect(loginButton).toBeVisible();
  await loginButton.click();

  /* EXERCISES PAGE */
  await expect(
    page.getByRole("heading", { name: /^exercises.*/i })
  ).toBeVisible();
});
