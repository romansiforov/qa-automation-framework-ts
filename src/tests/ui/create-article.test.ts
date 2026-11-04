import { test, expect } from '../../fixtures/test.fixture';
import { DataGenerator } from '../../utils/data-generator';

test('creates an article from the editor', async ({ app }) => {
  const { article } = DataGenerator.generateArticleData();

  await test.step('Open the editor', async () => {
    await app.editorPage.goto();
  });

  await test.step('Publish a new article', async () => {
    await app.editorPage.createArticle(article);
  });

  await test.step('Check that the article title is visible', async () => {
    await expect(
      app.page.getByRole('heading', { name: article.title, exact: true })
    ).toBeVisible();
  });
});
