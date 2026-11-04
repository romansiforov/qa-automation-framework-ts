import { CONFIG } from '../../config/env.config';
import { ArticleResponse, CreateArticlePayload } from '../models/article.model';
import { RequestHolder } from '../request-holder';

const { apiUrl } = CONFIG;

export class ArticlesController extends RequestHolder {
  /**
   * Creates an article for the authenticated user.
   */
  async createArticle(
    token: string,
    payload: CreateArticlePayload
  ): Promise<ArticleResponse> {
    const response = await this.request.post(`${apiUrl}/articles`, {
      headers: {
        Authorization: `Token ${token}`,
      },
      data: payload,
    });

    if (!response.ok()) {
      throw new Error(
        `Failed to create article: ${response.status()} ${response.statusText()} - ${await response.text()}`
      );
    }

    return (await response.json()) as ArticleResponse;
  }

  /**
   * Deletes an article by its slug.
   */
  async deleteArticle(token: string, slug: string): Promise<void> {
    const response = await this.request.delete(
      `${apiUrl}/articles/${encodeURIComponent(slug)}`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );

    if (!response.ok()) {
      throw new Error(
        `Failed to delete article "${slug}": ${response.status()} ${response.statusText()} - ${await response.text()}`
      );
    }
  }
}
