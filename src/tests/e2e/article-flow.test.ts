import { Urls } from '../../constants/urls.enum';
import { expect, test } from '../../fixtures/test.fixture';
import { DataGenerator } from '../../utils/data-generator';
import { StringHelper } from '../../utils/string.helper';

test.describe('Hybrid Article Flow', () => {
  let createdSlug: string | null = null;

  test.afterEach(async ({ api, authToken }) => {
    const slug = createdSlug;

    if (!slug) {
      return;
    }

    try {
      await api.articles.deleteArticle(authToken, slug);
    } catch (error) {
      console.error(`Failed to cleanup article with slug: ${slug}`, error);
    } finally {
      createdSlug = null;
    }
  });

  test(
    'shows an article prepared through the API',
    { tag: ['@e2e', '@articles', '@smoke'] },
    async ({ app, api, authToken }) => {
      const { article: draft } = DataGenerator.generateArticleData();

      await test.step('Arrange: Create article via API', async () => {
        const { article } = await api.articles.createArticle(authToken, {
          article: draft,
        });
        createdSlug = article.slug;
      });

      await test.step('Act: Navigate directly to the created article', async () => {
        await app.navigateTo(Urls.Home);
        await app.navigateTo(
          StringHelper.getArticleUrlByTitle(draft.title, Urls.Article),
          undefined,
          'networkidle'
        );
      });

      await test.step('Assert: Article title, content, and URL', async () => {
        const expectedUrl = StringHelper.getArticleUrlByTitle(
          draft.title,
          Urls.Article
        );

        await app.articlePage.waitForArticleLoaded();
        const actualTitle = await app.articlePage.getTitleText();
        const actualContent = await app.articlePage.getContentText();

        expect(app.page.url()).toContain(expectedUrl);
        expect(actualTitle).toBe(draft.title);
        expect(actualContent).toContain(
          StringHelper.getFirstBodyLine(draft.body)
        );
      });
    }
  );

  test('publishes an article from the editor UI', async ({ app }) => {
    const { article } = DataGenerator.generateArticleData();

    await test.step('Act: Navigate to editor and publish an article', async () => {
      await app.navigateTo(Urls.Home);
      await app.navigateTo(Urls.Editor);
      await app.editorPage.submitArticle(article);
      createdSlug = StringHelper.getSlugFromTitle(article.title);
    });

    await test.step('Assert: Article is successfully published and rendered', async () => {
      const expectedUrl = StringHelper.getArticleUrlByTitle(
        article.title,
        Urls.Article
      );

      await expect(app.articlePage.titleHeading()).toBeVisible();
      const actualTitle = await app.articlePage.getTitleText();
      const actualContent = await app.articlePage.getContentText();

      expect(app.page.url()).toContain(expectedUrl);
      expect(actualTitle).toBe(article.title);
      expect(actualContent).toContain(
        StringHelper.getFirstBodyLine(article.body)
      );
    });
  });
});
