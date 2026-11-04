import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const ENVIRONMENTS = ['dev', 'staging'] as const;

export type EnvironmentName = (typeof ENVIRONMENTS)[number];

export interface AppConfig {
  baseUrl: string;
  apiUrl: string;
  userEmail: string;
  userPassword: string;
  environment: EnvironmentName;
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. Add it to .env before running tests.`
    );
  }

  return value;
}

function readEnvironment(): EnvironmentName {
  const value = process.env.ENVIRONMENT?.trim() || 'dev';

  if (!ENVIRONMENTS.includes(value as EnvironmentName)) {
    throw new Error(
      `ENVIRONMENT must be one of: ${ENVIRONMENTS.join(', ')}. Received "${value}".`
    );
  }

  return value as EnvironmentName;
}

export const CONFIG: AppConfig = {
  baseUrl: process.env.BASE_URL?.trim() || 'https://demo.realworld.show',
  apiUrl: process.env.API_URL?.trim() || 'https://api.realworld.show/api',
  userEmail: requireEnv('USER_EMAIL'),
  userPassword: requireEnv('USER_PASSWORD'),
  environment: readEnvironment(),
};
