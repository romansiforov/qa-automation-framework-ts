import { PageHolder } from './page-holder';

/**
 * Conduit home page. Open it with `app.navigateTo(Urls.Home)`.
 */
export class HomePage extends PageHolder {
  /**
   * Waits until the signed-in account link is visible, then returns its text.
   */
  async getAccountLinkText(username: string): Promise<string> {
    await this.page
      .getByRole('link', { name: username, exact: true })
      .waitFor({ state: 'visible', timeout: 10000 });
    return (
      (await this.page
        .getByRole('link', { name: username, exact: true })
        .textContent()) ?? ''
    ).trim();
  }
}
