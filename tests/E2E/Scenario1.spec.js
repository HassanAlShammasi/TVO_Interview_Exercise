const { test, expect } = require('@playwright/test');

test('Navigate to grade level and verify curriculum section with checks', async ({ page }) => {
  // Step 1: Visit the home page and verify the URL and main header
  await page.goto('https://tvolearn.com/');
  await expect(page).toHaveURL('https://tvolearn.com/');
  const mainHeader = page.locator('h1');
  await expect(mainHeader).toBeVisible();
  await expect(mainHeader).toContainText('Learning Resources You Can Count On');

  // Step 2: Hover over "Learning Resources (K-12)" dropdown and verify dropdown visibility
  await page.hover('text=Learning Resources (K-12)');
  await page.click('text=Learning Resources (K-12)');
  const dropdown = page.locator('#SiteNavLabel-learning-resources-k-12 li span:has-text("Grade 7")');
  await expect(dropdown).toBeVisible();

  // Step 3: Select a grade level between 1 and 12 and verify navigation
  await page.click('#SiteNavLabel-learning-resources-k-12 li span:has-text("Grade 7")');; // Replace with another grade if needed
  await expect(page).toHaveURL(/grade-7/); // URL should contain the selected grade
  const gradePageHeader = page.locator('h1');
  await expect(gradePageHeader).toContainText('Grade 7'); // Adjust based on expected header text

  // Step 4: Scroll to the "Learn Forward in the Curriculum" section and verify section presence
  await page.evaluate(() => window.scrollBy(0, 1000)); // Adjust as necessary
  const curriculumSection = page.locator('text=Learn Forward in the Curriculum');
  await expect(curriculumSection).toBeVisible();

  // Step 5: Click on a card within the "Learn Forward in the Curriculum" section and verify navigation (Mathematics in this case)
  const mathButton = page.locator('a[href="/pages/grade-7-mathematics"]');
  await mathButton.click();
  await expect(page).toHaveURL(/grade-7-mathematics/); // URL should change to reflect the subject selected

  // Step 6: Validate that the subject page loads correctly with a visible, non-empty heading
  const pageHeading = page.locator('h1');
  await expect(pageHeading).toBeVisible();
  await expect(pageHeading).not.toBeEmpty(); // Ensures heading has text
  await expect(pageHeading).toContainText('Grade 7');
});