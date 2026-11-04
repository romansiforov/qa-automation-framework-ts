import { type APIRequestContext } from '@playwright/test';

/**
 * Base class for API controllers. Child classes inherit this constructor and use `this.request`.
 */
export class RequestHolder {
  constructor(public readonly request: APIRequestContext) {}
}
