import { type Locator } from '@playwright/test';
import { Urls } from '../constants/urls.enum';
import { PageHolder } from './page-holder';

export interface ArticleForm {
  title: string;
  description: string;
  body: string;
}

/**
 * Article editor at `/editor`.
 * Open a new article with `app.navigateTo(Urls.Editor)`.
 */
export class EditorPage extends PageHolder {
  readonly editorUrlBySlug = (slug: string): string => {
    return `${Urls.Editor}/${encodeURIComponent(slug)}`;
  };

  readonly titleInput = (): Locator => this.page.locator('input[name="title"]');

  readonly descriptionInput = (): Locator =>
    this.page.locator('input[name="description"]');

  readonly bodyInput = (): Locator =>
    this.page.locator('textarea[name="body"]');

  readonly publishButton = (): Locator =>
    this.page.getByRole('button', { name: 'Publish Article' });

  readonly errorMessages = (): Locator => this.page.locator('.error-messages');

  /**
   * Waits until the editor form is rendered and ready for input.
   */
  async waitForEditorLoaded(): Promise<void> {
    await this.titleInput().waitFor({ state: 'visible', timeout: 10000 });
    await this.bodyInput().waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Waits until the title field is visible, then returns its value.
   */
  async getTitleText(): Promise<string> {
    await this.titleInput().waitFor({ state: 'visible', timeout: 10000 });
    return (await this.titleInput().inputValue()) ?? '';
  }

  /**
   * Waits until the description field is visible, then returns its value.
   */
  async getDescriptionText(): Promise<string> {
    await this.descriptionInput().waitFor({ state: 'visible', timeout: 10000 });
    return (await this.descriptionInput().inputValue()) ?? '';
  }

  /**
   * Waits until the body field is visible, then returns its value.
   */
  async getBodyText(): Promise<string> {
    await this.bodyInput().waitFor({ state: 'visible', timeout: 10000 });
    return (await this.bodyInput().inputValue()) ?? '';
  }

  async fillTitle(title: string): Promise<void> {
    await this.titleInput().fill(title);
  }

  async fillDescription(description: string): Promise<void> {
    await this.descriptionInput().fill(description);
  }

  async fillBody(body: string): Promise<void> {
    await this.bodyInput().fill(body);
  }

  async clickPublishButton(): Promise<void> {
    await this.publishButton().click();
  }

  /**
   * Fills the editor form and publishes the article.
   */
  async submitArticle(article: ArticleForm): Promise<void> {
    await this.waitForEditorLoaded();
    await this.fillTitle(article.title);
    await this.fillDescription(article.description);
    await this.fillBody(article.body);
    await this.clickPublishButton();
  }
}
