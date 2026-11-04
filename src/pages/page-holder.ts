import { type Page } from '@playwright/test';

/**
 * Base class for page objects. Child pages inherit this constructor and use `this.page`.
 */
export class PageHolder {
  constructor(public readonly page: Page) {}
}
