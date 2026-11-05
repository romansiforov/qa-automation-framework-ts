import { CONFIG } from '../../config/env.config';
import {
  CommentResponse,
  MultipleCommentsResponse,
  NewCommentPayload,
} from '../models/comment.model';
import { RequestHolder } from '../request-holder';

const { apiUrl } = CONFIG;

export class CommentsController extends RequestHolder {
  /**
   * Lists comments for an article. Contract status: 200.
   */
  async getComments(
    token: string,
    slug: string
  ): Promise<MultipleCommentsResponse> {
    const response = await this.request.get(this.commentsUrl(slug), {
      headers: this.authHeaders(token),
    });

    return this.readJson<MultipleCommentsResponse>(
      response,
      200,
      `fetch comments for "${slug}"`
    );
  }

  /**
   * Creates a comment on an article. Contract status: 201.
   */
  async createComment(
    token: string,
    slug: string,
    payload: NewCommentPayload
  ): Promise<CommentResponse> {
    const response = await this.request.post(this.commentsUrl(slug), {
      headers: this.authHeaders(token),
      data: payload,
    });

    return this.readJson<CommentResponse>(
      response,
      201,
      `create comment on "${slug}"`
    );
  }

  /**
   * Deletes a comment. Contract status: 204, with no response body.
   */
  async deleteComment(token: string, slug: string, id: number): Promise<void> {
    const response = await this.request.delete(
      `${this.commentsUrl(slug)}/${id}`,
      {
        headers: this.authHeaders(token),
      }
    );

    await this.expectStatus(response, 204, `delete comment ${id} on "${slug}"`);
  }

  private authHeaders(token: string): { Authorization: string } {
    return { Authorization: `Token ${token}` };
  }

  private commentsUrl(slug: string): string {
    return `${apiUrl}/articles/${encodeURIComponent(slug)}/comments`;
  }
}
