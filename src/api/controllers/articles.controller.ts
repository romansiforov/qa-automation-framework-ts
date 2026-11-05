import { type APIResponse } from '@playwright/test';
import { CONFIG } from '../../config/env.config';
import {
  ArticleResponse,
  CreateArticlePayload,
  UpdateArticlePayload,
} from '../models/article.model';
import { RequestHolder } from '../request-holder';

const { apiUrl } = CONFIG;

/** Parsed article body plus the HTTP status that produced it. */
export type ArticleResult = ArticleResponse & { status: number };

export class ArticlesController extends RequestHolder {
  /**
   * Creates an article for the authenticated user. Contract status: 201.
   */
  async createArticle(
    token: string,
    payload: CreateArticlePayload
  ): Promise<ArticleResult> {
    const response = await this.request.post(`${apiUrl}/articles`, {
      headers: this.authHeaders(token),
      data: payload,
    });

    return this.readArticle(response, 201, 'create article');
  }

  /**
   * Fetches one article by its slug. Contract status: 200.
   */
  async getArticle(token: string, slug: string): Promise<ArticleResult> {
    const response = await this.request.get(this.articleUrl(slug), {
      headers: this.authHeaders(token),
    });

    return this.readArticle(response, 200, `fetch article "${slug}"`);
  }

  /**
   * Updates an article by its slug. The response slug can change when the title changes.
   * Contract status: 200.
   */
  async updateArticle(
    token: string,
    slug: string,
    payload: UpdateArticlePayload
  ): Promise<ArticleResult> {
    const response = await this.request.put(this.articleUrl(slug), {
      headers: this.authHeaders(token),
      data: payload,
    });

    return this.readArticle(response, 200, `update article "${slug}"`);
  }

  /**
   * Deletes an article by its slug. Contract status: 204, with no response body.
   */
  async deleteArticle(token: string, slug: string): Promise<number> {
    const response = await this.request.delete(this.articleUrl(slug), {
      headers: this.authHeaders(token),
    });

    await this.expectStatus(response, 204, `delete article "${slug}"`);
    return response.status();
  }

  private authHeaders(token: string): { Authorization: string } {
    return { Authorization: `Token ${token}` };
  }

  private articleUrl(slug: string): string {
    return `${apiUrl}/articles/${encodeURIComponent(slug)}`;
  }

  private async readArticle(
    response: APIResponse,
    expectedStatus: number,
    action: string
  ): Promise<ArticleResult> {
    const body = await this.readJson<ArticleResponse>(
      response,
      expectedStatus,
      action
    );
    return { ...body, status: response.status() };
  }
}
