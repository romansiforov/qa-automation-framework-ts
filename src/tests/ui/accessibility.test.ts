import AxeBuilder from '@axe-core/playwright';
import { type Page } from '@playwright/test';
import { Urls } from '../../constants/urls.enum';
import { expect, test } from '../../fixtures/test.fixture';

const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

/**
 * Known serious findings on the Conduit demo itself.
 * The document has no lang attribute, and the theme fails WCAG AA contrast.
 */
const knownConduitViolations = new Set(['html-has-lang', 'color-contrast']);

async function scanPage(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze();
  return results.violations;
}

test.describe('Home accessibility', () => {
  test('meets WCAG A and AA on the home page', async ({ app }, testInfo) => {
    await test.step('Navigation: Open the home page', async () => {
      await app.navigateTo(Urls.Home);
    });

    const violations =
      await test.step('Axe scan: Check WCAG rules', async () => {
        const found = await scanPage(app.page);
        await testInfo.attach('axe-violations.json', {
          body: JSON.stringify(found, null, 2),
          contentType: 'application/json',
        });
        return found;
      });

    await test.step('Assert: No critical or serious violations', async () => {
      const unexpected = violations.filter(
        (violation) =>
          (violation.impact === 'critical' || violation.impact === 'serious') &&
          !knownConduitViolations.has(violation.id)
      );

      expect(unexpected).toEqual([]);
    });
  });
});

test.describe('Login accessibility', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('meets WCAG A and AA on the login page', async ({ app }, testInfo) => {
    await test.step('Navigation: Open the login page', async () => {
      await app.navigateTo(Urls.Login);
    });

    const violations =
      await test.step('Axe scan: Check WCAG rules', async () => {
        const found = await scanPage(app.page);
        await testInfo.attach('axe-violations.json', {
          body: JSON.stringify(found, null, 2),
          contentType: 'application/json',
        });
        return found;
      });

    await test.step('Assert: No critical or serious violations', async () => {
      const unexpected = violations.filter(
        (violation) =>
          (violation.impact === 'critical' || violation.impact === 'serious') &&
          !knownConduitViolations.has(violation.id)
      );

      expect(unexpected).toEqual([]);
    });
  });
});
