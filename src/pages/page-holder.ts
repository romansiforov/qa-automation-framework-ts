import { type Page } from '@playwright/test';
import { type Urls } from '../constants/urls.enum';

export type NavigationWaitUntil =
  'load' | 'domcontentloaded' | 'networkidle' | 'commit';

/**
 * Base class for page objects. Child pages inherit this constructor and use `this.page`.
 */
export class PageHolder {
  constructor(public readonly page: Page) {}

  /**
   * Opens a route from `Urls`.
   * Moves the pointer onto the account link when `accountName` is set,
   * otherwise moves it inside the viewport so the page receives a real pointer position.
   */
  async navigateTo(
    url: Urls | string,
    accountName?: string,
    waitUntil: NavigationWaitUntil = 'domcontentloaded'
  ): Promise<void> {
    await this.page.goto(url, { waitUntil });

    if (accountName) {
      await this.page.getByRole('link', { name: accountName }).hover();
      return;
    }

    const viewport = this.page.viewportSize();
    const x = viewport ? Math.min(24, viewport.width - 1) : 24;
    const y = viewport ? Math.min(24, viewport.height - 1) : 24;
    await this.page.mouse.move(x, y);
  }
}
