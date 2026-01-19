import { expect, test } from "@playwright/test";

// Sanity check for happy path user journey:
// Login -> Exercises -> Complete Exercise -> Check for completion -> Logout
test("complete exercise", async ({ page }) => {
  // Drop this in where needed if we need to see what's on the screen.
  // DEBUG - screenshot
  // await page.screenshot({
  //   path: "/home/mpjovanovich/user/Desktop/test-assertion.png",
  //   fullPage: true,
  // });

  /* **************************************** */
  /* LOGIN FORM */
  /* **************************************** */
  await page.goto("/login/");

  let logoutButton = page.getByRole("button", { name: /logout/i });
  await expect(logoutButton).toHaveCount(0);

  let emailInput = page.getByLabel(/email/i);
  await expect(emailInput).toBeVisible();
  await emailInput.fill("dev@dev.com");

  let passwordInput = page.getByLabel(/password/i);
  await expect(passwordInput).toBeVisible();
  await passwordInput.fill("devUser");

  let loginButton = page.getByRole("button", { name: /sign in/i });
  await expect(loginButton).toBeVisible();
  await loginButton.click();

  /* **************************************** */
  /* EXERCISES PAGE */
  /* **************************************** */
  await expect(
    page.getByRole("heading", { name: /^exercises/i })
  ).toBeVisible();

  /* **************************************** */
  /* EXERCISE PAGE */
  /* **************************************** */
  let exerciseLink = page.getByRole("link", { name: /test exercise/i });
  await expect(exerciseLink).toBeVisible();
  await exerciseLink.click();

  await expect(
    page.getByRole("heading", { name: /test exercise/i })
  ).toBeVisible();

  // HARDCODED FIRST PAGE SCREEN
  await expect(
    page.getByText(
      "In this exercise you will complete a Python program step by step."
    )
  ).toBeVisible();
  await expect(page.getByText(/^## exercise:/i)).toBeVisible();
  let nextButton = page.getByRole("button", { name: /next/i });
  await expect(nextButton).toBeEnabled();
  await nextButton.click();

  // TEMPLATE STEP 1 SCREEN
  await expect(page.getByText("description1")).toBeVisible();
  await expect(page.getByText("instruction1")).toBeVisible();
  await expect(page.getByText(/^# comment/i)).toBeVisible();
  nextButton = page.getByRole("button", { name: /next/i });
  await expect(nextButton).toBeEnabled();
  await nextButton.click();

  // TEMPLATE STEP 2 SCREEN
  await expect(page.getByText("description2")).toBeVisible();
  await expect(page.getByText("instruction2")).toBeVisible();

  let codeInput = page.getByRole("textbox");
  await expect(codeInput).toHaveCount(1);
  await codeInput.fill("wrong");
  nextButton = page.getByRole("button", { name: /next/i });
  await expect(nextButton).not.toBeEnabled();

  await codeInput.fill("answer");
  nextButton = page.getByRole("button", { name: /next/i });
  await expect(nextButton).toBeEnabled();
  await nextButton.click();

  // SUBMIT SCREEN
  await expect(page.getByText(/^your program is complete/i)).toBeVisible();
  let submitButton = page.getByRole("button", { name: /submit/i });
  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  // TODO: We are going to redirect to exercises page with toast notification in upcoming work.
  // Not worth testing this bit until we do; after that we will check here to make sure that
  // we are redirected to the exercises page.

  /* LOGOUT */
  logoutButton = page.getByRole("button", { name: /logout/i });
  await expect(logoutButton).toBeVisible();
  await logoutButton.click();

  // We should be back on the login page.
  logoutButton = page.getByRole("button", { name: /logout/i });
  await expect(logoutButton).toHaveCount(0);
  emailInput = page.getByLabel(/email/i);
  await expect(emailInput).toBeVisible();
});
