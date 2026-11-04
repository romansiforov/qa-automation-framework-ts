import { faker } from '@faker-js/faker';
import { CreateArticlePayload } from '../api/models/article.model';
import { RegisterPayload } from '../api/models/user.model';

export class DataGenerator {
  /**
   * Builds a unique registration payload with an alphanumeric username, email, and password.
   */
  static generateUserData(): RegisterPayload {
    const username = `user${faker.string.alphanumeric({ length: 8, casing: 'lower' })}`;

    return {
      user: {
        username,
        email: `${username}@example.com`,
        password: faker.internet.password({ length: 12, memorable: false }),
      },
    };
  }

  /**
   * Builds a unique article payload. The title includes a random suffix so parallel runs do not collide.
   */
  static generateArticleData(): CreateArticlePayload {
    const titleSuffix = faker.string.alphanumeric({
      length: 6,
      casing: 'lower',
    });

    return {
      article: {
        title: `${faker.lorem.words({ min: 3, max: 6 })} ${titleSuffix}`,
        description: faker.lorem.sentence(),
        body: faker.lorem.paragraphs({ min: 1, max: 3 }),
        tagList: faker.helpers.uniqueArray(
          () => faker.word.noun().toLowerCase(),
          3
        ),
      },
    };
  }
}
