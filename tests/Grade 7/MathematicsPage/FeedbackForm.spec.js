const { test, expect } = require("@playwright/test");

test.describe("Validate feedback component", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://tvolearn.com/pages/grade-7-mathematics");
  });

  test("Check feedback type requirement", async ({ page }) => {
    //Open Feedback tab
    await page.hover("text=Feedback");
    await page.click("text=Feedback");

    //Fill all requirements except Feedback type
    await page.locator("id=feedback_message").fill("Test feedback");
    await page.locator("label:text('Learner')").click();

    //Should not let you submit due to missing feedback type
    const submitButton = page.locator("text=Submit");
    await submitButton.click();
    const errorMessage = page.locator('.modern-field.show-error .modern-field-error');
    await expect(errorMessage).toBeVisible;
    await expect(errorMessage).toContainText("This field is required");
  });

  test("Check additional details requirement", async ({ page }) => {
    //Open Feedback tab
    await page.hover("text=Feedback");
    await page.click("text=Feedback");

    //Fill all requirements except additional details
    await page.locator('label:text("Learning content")').click(); // Select feedback type
    await page.locator("label:text('Learner')").click(); //Select role type

    //Should not let you submit due to missing additional details
    const submitButton = page.locator("text=Submit");
    await submitButton.click();
    const errorMessage = page.locator('.modern-field.show-error .modern-field-error');
    await expect(errorMessage).toBeVisible;
    await expect(errorMessage).toContainText("This field is required");
  });

  test("Check role selection requirement", async ({ page }) => {
    //Open Feedback tab
    await page.hover("text=Feedback");
    await page.click("text=Feedback");

    //Fill all requirements except role selection
    await page.locator('label:text("Learning content")').click(); // Select feedback type
    await page.locator("id=feedback_message").fill("Test feedback");

    const submitButton = page.locator("text=Submit");
    await submitButton.click();
    const errorMessage = page.locator('.modern-field.show-error .modern-field-error');
    await expect(errorMessage).toBeVisible;
    await expect(errorMessage).toContainText("This field is required");
  });

  test("Check submit button is functional", async ({ page }) => {
    //Open Feedback tab
    await page.hover("text=Feedback");
    await page.click("text=Feedback");

    //Fill all requirements
    await page.locator('label:text("Learning content")').click(); // Select feedback type
    await page.locator("id=feedback_message").fill("Test feedback");
    await page.locator("label:text('Learner')").click(); //Select role type

    //Submit button works
    const submitButton = page.locator("text=Submit");
    await submitButton.isVisible();
    await submitButton.isEnabled();
    await submitButton.click();

    //Thank you message
    const thankYouText = page.locator("h3:text('Thank you')");
    await expect(thankYouText).toBeVisible();
  });
});
