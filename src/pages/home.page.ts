import { PageHolder } from './page-holder';

/**
 * Conduit home page.
 */
export class HomePage extends PageHolder {
  async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
