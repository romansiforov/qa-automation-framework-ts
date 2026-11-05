import { type ArticleResult } from '../../api/controllers/articles.controller';
import { test, expect } from '../../fixtures/test.fixture';
import { DataGenerator } from '../../utils/data-generator';

test.describe('Articles API CRUD', () => {
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

  test('should successfully create an article', async ({ api, authToken }) => {
    const payload = DataGenerator.generateArticleData();
    let created: ArticleResult;

    await test.step('Act: Create article via API', async () => {
      created = await api.articles.createArticle(authToken, payload);
      createdSlug = created.article.slug;
    });

    await test.step('Assert: Created article matches the payload', async () => {
      expect(created.status).toBe(201);
      expect(created.article.slug).toBeTruthy();
      expect(created.article.title).toBe(payload.article.title);
      expect(created.article.description).toBe(payload.article.description);
      expect(created.article.body).toBe(payload.article.body);
      expect(created.article.tagList).toEqual(
        expect.arrayContaining(payload.article.tagList ?? [])
      );
    });
  });

  test('should successfully fetch an existing article by slug', async ({
    api,
    authToken,
  }) => {
    const payload = DataGenerator.generateArticleData();
    let fetched: ArticleResult;

    await test.step('Arrange: Create article via API', async () => {
      const { article } = await api.articles.createArticle(authToken, payload);
      createdSlug = article.slug;
    });

    await test.step('Act: Fetch the article by slug', async () => {
      fetched = await api.articles.getArticle(authToken, createdSlug as string);
    });

    await test.step('Assert: Fetched article matches the payload', async () => {
      expect(fetched.status).toBe(200);
      expect(fetched.article.slug).toBe(createdSlug);
      expect(fetched.article.title).toBe(payload.article.title);
      expect(fetched.article.description).toBe(payload.article.description);
      expect(fetched.article.body).toBe(payload.article.body);
      expect(fetched.article.tagList).toEqual(
        expect.arrayContaining(payload.article.tagList ?? [])
      );
    });
  });

  test('should successfully update an article', async ({ api, authToken }) => {
    const payload = DataGenerator.generateArticleData();
    const updated = DataGenerator.generateArticleData();
    let updatedResult: ArticleResult;
    let fetched: ArticleResult;

    await test.step('Arrange: Create article via API', async () => {
      const { article } = await api.articles.createArticle(authToken, payload);
      createdSlug = article.slug;
    });

    await test.step('Act: Update title, description, and body', async () => {
      updatedResult = await api.articles.updateArticle(
        authToken,
        createdSlug as string,
        {
          article: {
            title: updated.article.title,
            description: updated.article.description,
            body: updated.article.body,
          },
        }
      );
      createdSlug = updatedResult.article.slug;
      fetched = await api.articles.getArticle(authToken, createdSlug as string);
    });

    await test.step('Assert: Updated article is returned by slug', async () => {
      expect(updatedResult.status).toBe(200);
      expect(updatedResult.article.title).toBe(updated.article.title);
      expect(updatedResult.article.description).toBe(
        updated.article.description
      );
      expect(updatedResult.article.body).toBe(updated.article.body);
      expect(fetched.status).toBe(200);
      expect(fetched.article.title).toBe(updated.article.title);
      expect(fetched.article.body).toBe(updated.article.body);
    });
  });

  test('should successfully delete an article', async ({ api, authToken }) => {
    const payload = DataGenerator.generateArticleData();
    let slug = '';
    let status = 0;

    await test.step('Arrange: Create article via API', async () => {
      const { article } = await api.articles.createArticle(authToken, payload);
      slug = article.slug;
      createdSlug = slug;
    });

    await test.step('Act: Delete the article', async () => {
      status = await api.articles.deleteArticle(authToken, slug);
      createdSlug = null;
    });

    await test.step('Assert: Delete returns 204 and the article is gone', async () => {
      expect(status).toBe(204);
      await expect(api.articles.getArticle(authToken, slug)).rejects.toThrow(
        'received 404'
      );
    });
  });
});
