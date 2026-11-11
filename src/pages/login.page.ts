import { type Locator } from '@playwright/test';
import { PageHolder } from './page-holder';

/**
 * Login page at `/login`.
 * Open it with `app.navigateTo(Urls.Login)`.
 */
export class LoginPage extends PageHolder {
  readonly emailInput = (): Locator => this.page.locator('input[type="email"]');

  readonly passwordInput = (): Locator =>
    this.page.locator('input[type="password"]');

  readonly signInButton = (): Locator =>
    this.page.getByRole('button', { name: 'Sign in' });

  readonly errorMessageList = (): Locator =>
    this.page.locator('.error-messages li');

  async fillEmail(email: string): Promise<void> {
    await this.emailInput().fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput().fill(password);
  }

  /**
   * Fills the email and password fields.
   */
  async fillForm(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
  }

  async clickSignIn(): Promise<void> {
    await this.signInButton().click();
  }

  /**
   * Fills the login form and submits it.
   * A dropped login request stays on this page with "Unable to connect",
   * so that attempt is submitted once more.
   */
  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSignIn();

    const signedIn = await this.page
      .waitForURL((url) => url.pathname !== '/login', { timeout: 10000 })
      .then(() => true)
      .catch(() => false);

    if (signedIn) {
      return;
    }

    const errors = await this.errorMessageList().allTextContents();
    const connectionDropped = errors.some((text) =>
      text.includes('Unable to connect')
    );

    if (connectionDropped) {
      await this.clickSignIn();
    }
  }

  /**
   * Stores the Conduit session token before the next navigation.
   * This demo frontend reads `jwtToken` from `localStorage`.
   */
  async injectAuthToken(token: string): Promise<void> {
    await this.page.addInitScript((value) => {
      window.localStorage.setItem('jwtToken', value);
    }, token);
  }

  /**
   * Reads the session token after the app has loaded.
   */
  async getAuthToken(): Promise<string> {
    return (
      (await this.page.evaluate(() =>
        window.localStorage.getItem('jwtToken')
      )) ?? ''
    );
  }

  /**
   * Waits until validation errors are visible, then returns each message.
   */
  async getErrorMessageTexts(): Promise<string[]> {
    await this.errorMessageList()
      .first()
      .waitFor({ state: 'visible', timeout: 10000 });
    const texts = await this.errorMessageList().allTextContents();
    return texts.map((text) => text.trim()).filter((text) => text.length > 0);
  }
}
