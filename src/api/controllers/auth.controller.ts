import { CONFIG } from '../../config/env.config';
import {
  LoginPayload,
  RegisterPayload,
  RegisteredUser,
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

    const { user } = await this.readJson<UserResponse>(response, 200, 'log in');
    return user.token;
  }

  /**
   * Registers a user. Contract status: 201.
   * Generates a unique user when no payload is provided.
   */
  async register(
    payload: RegisterPayload = DataGenerator.generateUserData()
  ): Promise<RegisteredUser> {
    const response = await this.request.post(`${apiUrl}/users`, {
      data: payload,
    });
    const { user } = await this.readJson<UserResponse>(
      response,
      201,
      'register user'
    );

    return { credentials: payload, user };
  }

  /**
   * Registers a unique user, then returns the email and password used to log in.
   */
  private async registerAndBuildLogin(): Promise<LoginPayload> {
    const { credentials } = await this.register();

    return {
      user: {
        email: credentials.user.email,
        password: credentials.user.password,
      },
    };
  }
}
