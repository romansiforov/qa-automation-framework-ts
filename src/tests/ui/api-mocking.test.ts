import { Urls } from '../../constants/urls.enum';
import { expect, test } from '../../fixtures/test.fixture';
import { DataGenerator } from '../../utils/data-generator';

test.describe('Editor API resilience', () => {
  test('keeps the editor open when publishing returns 500', async ({ app }) => {
    const { article } = DataGenerator.generateArticleData();

    await test.step('Arrange: Fail article creation with HTTP 500', async () => {
      await app.page.route('**/api/articles', async (route) => {
        if (route.request().method() !== 'POST') {
          await route.continue();
          return;
        }

        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            errors: { server: ['Internal server error occurred'] },
          }),
        });
      });
    });

    await test.step('Act: Open the editor and publish an article', async () => {
      await app.navigateTo(Urls.Editor);
      await app.editorPage.submitArticle(article);
    });

    await test.step('Assert: The editor shows the error and stays usable', async () => {
      await expect(app.editorPage.errorMessages()).toBeVisible();
      await expect(app.page).toHaveURL(new RegExp(Urls.Editor));
      await expect(app.editorPage.publishButton()).toBeVisible();
    });
  });
});
