import { test as base, expect } from '@playwright/test';
import { API } from '../api/api';
import { type ArticleData } from '../api/models/article.model';
import { Application } from '../pages/application';
import { readAuthToken } from '../support/global-setup';
import { DataGenerator } from '../utils/data-generator';

/**
 * Custom fixtures available to every test that imports `test` from this file.
 */
export interface MyFixtures {
  /** API controllers for auth and articles. */
  api: API;
  /** Page objects for the signed-in browser page. */
  app: Application;
  /** JWT for the user created by global setup. */
  authToken: string;
  /** Article created through the API for this test and deleted afterwards. */
  createArticle: ArticleData;
}

/**
 * Playwright `test` extended with an API client, page objects, and a disposable article.
 * `authToken` is the user saved by global setup, the same user as the browser storage state.
 * `app` uses the page that Playwright opens with that storage state.
 * `createArticle` creates an article before the test and deletes it after.
 */
export const test = base.extend<MyFixtures>({
  api: async ({ request }, use) => {
    await use(new API(request));
  },

  // This fixture reads a file and has no Playwright dependencies. The object is still required.
  // eslint-disable-next-line no-empty-pattern
  authToken: async ({}, use) => {
    await use(readAuthToken());
  },

  app: async ({ page }, use) => {
    await use(new Application(page));
  },

  /**
   * Creates a unique article before the test and deletes it afterwards.
   */
  createArticle: async ({ api, authToken }, use) => {
    const articleData = DataGenerator.generateArticleData();
    const { article } = await api.articles.createArticle(
      authToken,
      articleData
    );

    await use(article);

    await api.articles.deleteArticle(authToken, article.slug);
  },
});

export { expect };
