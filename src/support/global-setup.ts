import fs from 'fs';
import path from 'path';
import { request, type FullConfig } from '@playwright/test';
import { AuthController } from '../api/controllers/auth.controller';
import { CONFIG } from '../config/env.config';

export const authStorageFile = path.resolve(
  __dirname,
  '../../playwright/.auth/user.json'
);

interface StoredLocalStorageItem {
  name: string;
  value: string;
}

interface AuthStorageState {
  cookies: [];
  origins: Array<{
    origin: string;
    localStorage: StoredLocalStorageItem[];
  }>;
}

/**
 * Registers one user and stores its JWT so every test starts already signed in.
 */
async function globalSetup(_config: FullConfig): Promise<void> {
  const apiContext = await request.newContext();
  const token = await new AuthController(apiContext).login();
  await apiContext.dispose();

  const storageState: AuthStorageState = {
    cookies: [],
    origins: [
      {
        origin: CONFIG.baseUrl,
        localStorage: [{ name: 'jwtToken', value: token }],
      },
    ],
  };

  fs.mkdirSync(path.dirname(authStorageFile), { recursive: true });
  fs.writeFileSync(authStorageFile, JSON.stringify(storageState, null, 2));
}

/**
 * Reads the JWT saved by global setup. API calls must use this same user as the browser.
 */
export function readAuthToken(): string {
  const storageState = JSON.parse(
    fs.readFileSync(authStorageFile, 'utf8')
  ) as AuthStorageState;
  const token = storageState.origins
    .flatMap((origin) => origin.localStorage)
    .find((item) => item.name === 'jwtToken')?.value;

  if (!token) {
    throw new Error(
      `No jwtToken in ${authStorageFile}. Global setup must run before the tests.`
    );
  }

  return token;
}

export default globalSetup;
