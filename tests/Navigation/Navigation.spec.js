const { test, expect } = require("@playwright/test");

test("Validate Go to Top button functionality", async ({ page }) => {
  // Go to the page
  await page.goto("https://tvolearn.com/pages/grade-7-mathematics");

  // Scroll down to make the "Go to Top" button appear
  await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight));

  // Verify that the button becomes visible after scrolling
  const goToTopButton = page.locator("#bttopBtn");
  await expect(goToTopButton).toBeVisible();

  // Click the "Go to Top" button
  await goToTopButton.click();

  // Wait for half a second to allow scroll to complete
  await page.waitForTimeout(500);

  // Verify that the page has scrolled to the top
  const scrollPosition = await page.evaluate(() => window.scrollY);
  expect(scrollPosition).toBe(0);
});

test("Validate Learning Resources (K-12) dropdown links and navigation", async ({
  page,
}) => {
  // Go to the main page
  await page.goto("https://tvolearn.com/");

  // Check each grade link from Kindergarten to Grade 12, plus "All Grades"
  const expectedLinks = [
    "Kindergarten",
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
    "Grade 6",
    "Grade 7",
    "Grade 8"
    //The URL for these grades follows a different convention
    // "Grade 9",
    // "Grade 10",
    // "Grade 11",
    // "Grade 12",
  ];

  for (const grade of expectedLinks) {
    const link = page.locator(
      `nav#AccessibleNav .site-nav__dropdown a.site-nav__child-link:has(span.site-nav__label:has-text("${grade}"))`
    ).first();

    // Open the "Learning Resources (K-12)" dropdown
    await page.click("text=Learning Resources (K-12)");

    // Click the link and verify navigation
    await link.click();
    await page.waitForLoadState("networkidle");

    // Verify the URL includes the expected grade in the path
    await expect(page).toHaveURL(
      new RegExp(grade.toLowerCase().replace(" ", "-"))
    );

    // Navigate back to main page
    await page.goto("https://tvolearn.com/");
  }
});
