import { Urls } from '../../constants/urls.enum';
import { expect, test } from '../../fixtures/test.fixture';

interface LoginValidationCase {
  name: string;
  email: string;
  password: string;
  expectedError: string;
}

const loginValidationCases: LoginValidationCase[] = [
  {
    name: 'invalid email format',
    email: 'invalid-email',
    password: 'password123',
    expectedError: 'email is invalid',
  },
  {
    name: 'incorrect credentials',
    email: 'nonexistent@test.com',
    password: 'wrongpass',
    expectedError: 'credentials invalid',
  },
];

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

  for (const loginCase of loginValidationCases) {
    test(`rejects login for ${loginCase.name}`, async ({ app }) => {
      await test.step(`Act: Submit ${loginCase.name}`, async () => {
        await app.navigateTo(Urls.Login);
        await app.loginPage.fillForm(loginCase.email, loginCase.password);
        await app.loginPage.clickSignIn();
      });

      await test.step('Assert: The expected error is shown', async () => {
        const errors = await app.loginPage.getErrorMessageTexts();

        expect(errors).toContain(loginCase.expectedError);
      });
    });
  }

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
