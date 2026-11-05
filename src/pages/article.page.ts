import { type Locator } from '@playwright/test';
import { Urls } from '../constants/urls.enum';
import { PageHolder } from './page-holder';

/**
 * Published article at `/article/:slug`.
 * Open it with `app.navigateTo(app.articlePage.articleUrlBySlug(slug))`.
 */
export class ArticlePage extends PageHolder {
  readonly articleUrlBySlug = (slug: string): string => {
    return `${Urls.Article}/${encodeURIComponent(slug)}`;
  };

  /**
   * Article page shell. It is mounted before the title is rendered.
   */
  private readonly articleShell = (): Locator =>
    this.page.locator('.article-page');

  readonly deleteArticleButton = this.page.getByRole('button', {
    name: /Delete Article/i,
  });

  /**
   * Article title. Feed cards and the home banner also use `h1`,
   * so this stays inside `.article-page`.
   */
  readonly titleHeading = (): Locator => this.page.locator('.article-page h1');

  /**
   * Rendered markdown body.
   */
  private readonly articleContent = (): Locator =>
    this.page.locator('.article-content');

  /**
   * Waits until the article shell, title, and body are visible.
   * The shell can open while the article request is aborted, so the page is
   * reloaded once when the title never appears.
   */
  async waitForArticleLoaded(): Promise<void> {
    await this.articleShell().waitFor({ state: 'visible', timeout: 10000 });
    const titleVisible = await this.titleHeading()
      .waitFor({ state: 'visible', timeout: 10000 })
      .then(() => true)
      .catch(() => false);

    if (!titleVisible) {
      await this.page.reload({ waitUntil: 'domcontentloaded' });
      await this.articleShell().waitFor({ state: 'visible', timeout: 10000 });
      await this.titleHeading().waitFor({ state: 'visible', timeout: 10000 });
    }

    await this.articleContent()
      .filter({ hasText: /.+/ })
      .waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Waits until the title is rendered, then returns its text.
   */
  async getTitleText(): Promise<string> {
    await this.titleHeading().waitFor({ state: 'visible', timeout: 10000 });
    return (await this.titleHeading().textContent())?.trim() ?? '';
  }

  /**
   * Waits until the article body is rendered, then returns its text.
   */
  async getContentText(): Promise<string> {
    await this.articleContent()
      .filter({ hasText: /.+/ })
      .waitFor({ state: 'visible', timeout: 10000 });
    return (await this.articleContent().textContent())?.trim() ?? '';
  }
}
