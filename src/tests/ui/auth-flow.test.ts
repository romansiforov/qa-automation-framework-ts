import { Urls } from '../../constants/urls.enum';
import { expect, test } from '../../fixtures/test.fixture';

test.describe('Authentication UI Flow', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('keeps Sign in disabled until both fields are filled', async ({
    app,
  }) => {
    await test.step('Act: Open the login page with empty fields', async () => {
      await app.navigateTo(Urls.Login);
    });

    await test.step('Assert: Sign in stays disabled', async () => {
      await expect(app.loginPage.signInButton()).toBeDisabled();
    });
  });

  test('shows an error for invalid credentials', async ({ app }) => {
    await test.step('Act: Submit an unknown email and password', async () => {
      await app.navigateTo(Urls.Login);
      await app.loginPage.fillEmail('nobody-auth-check@example.com');
      await app.loginPage.fillPassword('wrong-password');
      await app.loginPage.clickSignIn();
    });

    await test.step('Assert: The API rejects the credentials', async () => {
      const errors = await app.loginPage.getErrorMessageTexts();

      expect(errors).toContain('credentials invalid');
    });
  });

  test('signs in through the login form', async ({ app, api }) => {
    const registered = await api.auth.register();

    await test.step('Act: Open login and sign in with the new user', async () => {
      await app.navigateTo(Urls.Login);
      await app.loginPage.login(
        registered.credentials.user.email,
        registered.credentials.user.password
      );
    });

    await test.step('Assert: The user lands on home and is authenticated', async () => {
      await expect(app.page).toHaveURL((url) => url.pathname === Urls.Home);
      expect(await app.loginPage.getAuthToken()).toBeTruthy();
      expect(
        await app.homePage.getAccountLinkText(registered.user.username)
      ).toBe(registered.user.username);
    });
  });

  test('authenticates from a token stored before navigation', async ({
    app,
    api,
  }) => {
    const registered = await api.auth.register();
    const token = registered.user.token;

    await test.step('Act: Store the token and open home', async () => {
      await app.loginPage.injectAuthToken(token);
      await app.navigateTo(Urls.Home);
    });

    await test.step('Assert: Home opens as the authenticated user', async () => {
      await expect(app.page).toHaveURL((url) => url.pathname === Urls.Home);
      expect(await app.loginPage.getAuthToken()).toBe(token);
      expect(
        await app.homePage.getAccountLinkText(registered.user.username)
      ).toBe(registered.user.username);
    });
  });
});
