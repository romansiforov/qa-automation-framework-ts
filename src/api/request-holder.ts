import { type APIRequestContext, type APIResponse } from '@playwright/test';

/**
 * Base class for API controllers. Child classes inherit this constructor and use `this.request`.
 */
export class RequestHolder {
  constructor(public readonly request: APIRequestContext) {}

  /**
   * Rejects the call unless the response status is exactly the code from the API contract.
   */
  protected async expectStatus(
    response: APIResponse,
    expectedStatus: number,
    action: string
  ): Promise<void> {
    if (response.status() === expectedStatus) {
      return;
    }

    throw new Error(
      `Failed to ${action}: expected ${expectedStatus}, received ${response.status()} ${response.statusText()} - ${await response.text()}`
    );
  }

  /**
   * Checks the status, then returns the JSON body as `T`.
   */
  protected async readJson<T>(
    response: APIResponse,
    expectedStatus: number,
    action: string
  ): Promise<T> {
    await this.expectStatus(response, expectedStatus, action);
    return (await response.json()) as T;
  }
}
