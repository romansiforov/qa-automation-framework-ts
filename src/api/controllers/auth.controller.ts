import { CONFIG } from '../../config/env.config';
import {
  LoginPayload,
  RegisterPayload,
  UserResponse,
} from '../models/user.model';
import { RequestHolder } from '../request-holder';
import { DataGenerator } from '../../utils/data-generator';

const { apiUrl } = CONFIG;

export class AuthController extends RequestHolder {
  /**
   * Logs in a user and returns the JWT token.
   * When no payload is provided, registers a new user and logs in as that user.
   */
  async login(payload?: LoginPayload): Promise<string> {
    const body = payload ?? (await this.registerAndBuildLogin());

    const response = await this.request.post(`${apiUrl}/users/login`, {
      data: body,
    });

    if (!response.ok()) {
      throw new Error(
        `Login failed: ${response.status()} ${response.statusText()} - ${await response.text()}`
      );
    }

    const { user } = (await response.json()) as UserResponse;
    return user.token;
  }

  /**
   * Registers a unique user, then returns the email and password used to log in.
   */
  private async registerAndBuildLogin(): Promise<LoginPayload> {
    const registration: RegisterPayload = DataGenerator.generateUserData();
    const response = await this.request.post(`${apiUrl}/users`, {
      data: registration,
    });

    if (!response.ok()) {
      throw new Error(
        `Registration failed: ${response.status()} ${response.statusText()} - ${await response.text()}`
      );
    }

    return {
      user: {
        email: registration.user.email,
        password: registration.user.password,
      },
    };
  }
}
