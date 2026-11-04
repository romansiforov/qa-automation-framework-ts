import { ArticlesController } from './controllers/articles.controller';
import { AuthController } from './controllers/auth.controller';
import { RequestHolder } from './request-holder';

/**
 * Aggregates every API controller for the current request context.
 */
export class API extends RequestHolder {
  public readonly auth: AuthController = new AuthController(this.request);
  public readonly articles: ArticlesController = new ArticlesController(
    this.request
  );
}
