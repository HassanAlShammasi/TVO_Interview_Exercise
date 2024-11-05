const { test, expect } = require('@playwright/test');

test('Validate footer links are enabled and navigate correctly', async ({ page }) => {
  // Navigate to the Grade 7 page
  await page.goto('https://tvolearn.com/pages/grade-7');

  // Define footer links and their expected URLs
  const footerLinks = [
    { locator: 'a[href*="instagram.com"]', expectedUrl: /instagram.com/ },
    { locator: 'a[href*="youtube.com"]', expectedUrl: /youtube.com/ },
    { locator: 'a[href*="facebook.com"]', expectedUrl: /facebook.com/ },
    { locator: 'a[href*="twitter.com"]', expectedUrl: /x.com/ }
  ];

  for (const { locator, expectedUrl } of footerLinks) {
    const link = page.locator(locator);
    
    // Check that each link is both visible and enabled
    await Promise.all([
      expect(link).toBeVisible(),
      expect(link).toBeEnabled()
    ]);

    // Click the link and verify it navigates to the correct URL
    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      link.click()
    ]);

    await expect(newPage).toHaveURL(expectedUrl);
    await newPage.close(); // Close the popup to proceed with the next link
  }
});

test('Validate Newsletter Signup form', async ({ page }) => {
  // Step 1: Go to the page with the newsletter form
  await page.goto('https://tvolearn.com/pages/grade-7-mathematics');

  // Step 2: Check if the newsletter signup form is visible
  const signupForm = page.locator('id=mce-EMAIL');
  await expect(signupForm).toBeVisible();
  await expect(signupForm).toBeEmpty();

  // Step 3: Enter a valid email address in the email input field
  const emailInput = page.locator('id=mce-EMAIL'); // Replace with actual input selector
  await emailInput.fill('test@example.com');
  await expect(emailInput).toHaveValue('test@example.com');

  // Step 4: Click the submit button
  const submitButton = page.locator('id=mc-embedded-subscribe');
  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  // Check if the expected message appears
  const successMessage = page.locator('text=Almost finished... We need to confirm your email address. To complete the subscription process, please click the link in the email we just sent you.');
  await expect(successMessage).toBeVisible();
});

test('Verify Subscribe button does not work without email input', async ({ page }) => {
  // Step 1: Go to the page with the newsletter form
  await page.goto('https://tvolearn.com/pages/grade-7-mathematics'); 

  // Step 2: Locate the subscribe button and ensure it is disabled or doesn't trigger submission
  const subscribeButton = page.locator('#mc-embedded-subscribe');

  // Verify it does not submit without an email
  await subscribeButton.click();
  const successMessage = page.locator('text=Almost finished... We need to confirm your email address. To    complete the subscription process, please click the link in the email we just sent you.');
  await expect(successMessage).not.toBeVisible();
  const errorMessage = page.locator('div[for="mce-EMAIL"].mce_inline_error');
  await expect(errorMessage).toBeVisible();
});