import { expect, test } from "@playwright/test";

// Just login for now
test("login", async ({ page }) => {
  await page.goto("/login/");

  // Check for login UI - should have a "password" label
  await expect(page.getByLabel(/password/i)).toBeVisible();

  //   // Fill in login form
  //   await page.getByLabel('Email').fill('test@test.com');
  //   await page.getByLabel('Password').fill('test');

  //   // Click login button
  //   await page.getByRole('button', { name: 'Login' }).click();

  // Check for dashboard UI
});
