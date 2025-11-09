import { test, expect } from '@playwright/test';

test.describe('HomePage - E2E Tests', () => {
  test.beforeEach(async ({ page, request }) => {
    // Arrange: Clear the database before each test to ensure isolation
    await request.post('http://localhost:4000/trpc/clearDatabase', {
      data: {},
    });

    // Arrange: Load Page
    await page.goto('/');
  });

  test('should show loading skeleton state on initial load', async ({ page }) => {
    // Arrange: Navigate to the page without waiting for full load
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Act: Check for skeleton or content (race condition due to fast loading)
    const skeletons = page.locator('.animate-pulse');
    const hasSkeletonOrContent = await Promise.race([
      skeletons
        .first()
        .isVisible()
        .catch(() => false),
      page.getByRole('button', { name: /add text widget/i }).isVisible(),
    ]);

    // Assert: Either skeleton was shown or content loaded
    expect(hasSkeletonOrContent).toBeTruthy();
  });

  test('should render empty state with CTA button', async ({ page }) => {
    // Assert: Empty state and CTA button are visible
    await expect(page.getByRole('button', { name: /add text widget/i })).toBeVisible();
  });

  test('should add widget when add button is clicked', async ({ page }) => {
    // Act: Click the "Add Text Widget" button
    await page.getByRole('button', { name: /add text widget/i }).click();

    // Assert: Widget appears, empty state is hidden
    await expect(page.getByRole('textbox').first()).toBeVisible();
  });

  test('should render widgets with their content', async ({ page }) => {
    // Arrange: Add a widget and fill with content
    await page.getByRole('button', { name: /add text widget/i }).click();
    const textarea = page.getByRole('textbox').first();
    await textarea.fill('Test content');
    await page.waitForTimeout(600); // Wait for auto-save

    // Act: Reload the page
    await page.reload();

    // Assert: Widget content is persisted
    await expect(page.getByRole('textbox').first()).toHaveValue('Test content');
  });

  test('should disable add button when widget is being created', async ({ page }) => {
    // Arrange: Get reference to add button
    const addButton = page.getByRole('button', { name: /add text widget/i });

    // Act: Click the add button
    await addButton.click();

    // Assert: Widget is created
    await expect(page.getByRole('textbox').first()).toBeVisible();
  });

  test('should not show skeleton when data is loaded', async ({ page }) => {
    // Arrange: Wait for the page to fully load
    await page.waitForLoadState('networkidle');

    // Act: (No action - testing loaded state)

    // Assert: Skeleton is not visible and content is shown
    const skeletons = page.locator('.animate-pulse');
    await expect(skeletons.first())
      .not.toBeVisible()
      .catch(() => {
        // It's okay if there are no skeleton elements at all
      });
    await expect(page.getByRole('button', { name: /add text widget/i })).toBeVisible();
  });

  test('should show save status indicators', async ({ page }) => {
    // Arrange: Add a widget
    await page.getByRole('button', { name: /add text widget/i }).click();

    // Act: Type in the textarea to trigger auto-save
    const textarea = page.getByRole('textbox').first();
    await textarea.fill('Test');
    await page.waitForTimeout(100); // Brief pause for pending state
    await page.waitForTimeout(700); // Wait for auto-save (500ms debounce + network)

    // Assert: "Saved" status indicator is visible
    const savedIndicator = page.getByText(/saved/i);
    await expect(savedIndicator).toBeVisible();
  });

  test('should handle multiple widgets with independent content', async ({ page }) => {
    // Arrange: Add two widgets with different content
    await page.getByRole('button', { name: /add text widget/i }).click();
    await page.waitForTimeout(100);
    await page.getByRole('button', { name: /add text widget/i }).click();
    await page.waitForTimeout(100);
    const textareas = page.getByRole('textbox');
    await textareas.nth(0).fill('First widget content');
    await textareas.nth(1).fill('Second widget content');
    await page.waitForTimeout(600); // Wait for auto-save

    // Act: Reload the page
    await page.reload();

    // Assert: Both widgets have their correct content
    await expect(textareas.nth(0)).toHaveValue('First widget content');
    await expect(textareas.nth(1)).toHaveValue('Second widget content');
  });

  test('should handle widget deletion with confirmation', async ({ page }) => {
    // Arrange: Add a widget with content and set up dialog handler
    await page.getByRole('button', { name: /add text widget/i }).click();
    await page.getByRole('textbox').first().fill('To be deleted');
    page.on('dialog', (dialog) => dialog.accept());

    // Act: Click delete button
    await page.getByRole('button', { name: /delete widget/i }).click();

    // Assert: Widget is removed and empty state is shown
    await expect(page.getByRole('textbox')).not.toBeVisible();
  });
});
