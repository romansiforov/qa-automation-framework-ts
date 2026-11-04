import { type Locator } from '@playwright/test';
import { PageHolder } from './page-holder';

export interface ArticleForm {
  title: string;
  description: string;
  body: string;
}

/**
 * Article editor at `/editor`.
 */
export class EditorPage extends PageHolder {
  readonly titleInput: Locator = this.page.getByRole('textbox', {
    name: 'Article Title',
  });
  readonly descriptionInput: Locator = this.page.getByRole('textbox', {
    name: "What's this article about?",
  });
  readonly bodyInput: Locator = this.page.getByRole('textbox', {
    name: 'Write your article (in markdown)',
  });
  readonly publishButton: Locator = this.page.getByRole('button', {
    name: 'Publish Article',
  });

  async goto(): Promise<void> {
    await this.page.goto('/editor');
  }

  /**
   * Fills the editor form and publishes the article.
   */
  async createArticle(article: ArticleForm): Promise<void> {
    await this.titleInput.fill(article.title);
    await this.descriptionInput.fill(article.description);
    await this.bodyInput.fill(article.body);
    await this.publishButton.click();
  }
}
