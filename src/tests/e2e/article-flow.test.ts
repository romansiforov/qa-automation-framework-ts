import { test, expect } from '../../fixtures/test.fixture';
import { DataGenerator } from '../../utils/data-generator';

test.describe('Hybrid Article Flow', () => {
  let createdSlug: string | null = null;

  test.afterEach(async ({ api, authToken }) => {
    const slug = createdSlug;

    if (!slug) {
      return;
    }

    await test.step(`Teardown: Delete article via API (${slug})`, async () => {
      await api.articles.deleteArticle(authToken, slug);
      createdSlug = null;
    });
  });

  test('shows an article prepared through the API', async ({
    app,
    api,
    authToken,
  }) => {
    const { article: draft } = DataGenerator.generateArticleData();

    await test.step('Arrange: Create article via API', async () => {
      const { article } = await api.articles.createArticle(authToken, {
        article: draft,
      });
      createdSlug = article.slug;
    });

    await test.step('Act: Navigate directly to the created article', async () => {
      await app.homePage.goto();
      await app.page.goto(`/article/${createdSlug}`);
    });

    await test.step('Assert: Article title is visible in UI', async () => {
      await expect(
        app.page.getByRole('heading', { name: draft.title, exact: true })
      ).toBeVisible();
    });
  });

  test('publishes an article from the editor UI', async ({ app }) => {
    const { article } = DataGenerator.generateArticleData();

    await test.step('Act: Navigate to editor and create an article via UI', async () => {
      await app.homePage.goto();
      await app.editorPage.goto();
      await app.editorPage.createArticle(article);
      await app.page.waitForURL(/\/article\//);

      const slug = new URL(app.page.url()).pathname.split('/').at(-1);
      createdSlug = slug ? decodeURIComponent(slug) : null;
    });

    await test.step('Assert: Article is successfully published and rendered', async () => {
      await expect(
        app.page.getByRole('heading', { name: article.title, exact: true })
      ).toBeVisible();
    });
  });
});
