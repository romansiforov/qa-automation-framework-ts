import { test, expect } from '../../fixtures/test.fixture';

test('article created via API is visible in the UI', async ({
  app,
  createArticle,
}) => {
  await test.step('Open the created article', async () => {
    await app.page.goto(`/article/${createArticle.slug}`);
  });

  await test.step('Check that the article title is visible', async () => {
    await expect(
      app.page.getByRole('heading', { name: createArticle.title, exact: true })
    ).toBeVisible();
  });
});
