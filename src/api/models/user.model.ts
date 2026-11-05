// Interface for the login request body (payload)
export interface LoginPayload {
  user: {
    email: string;
    password: string;
  };
}

// Interface for the registration request body (payload)
export interface RegisterPayload {
  user: {
    username: string;
    email: string;
    password: string;
  };
}

// User object returned by the API
export interface UserData {
  email: string;
  token: string;
  username: string;
  bio: string | null;
  image: string | null;
}

// Server response wrapper for login and registration
export interface UserResponse {
  user: UserData;
}

/** Credentials sent to the API and the user record returned after registration. */
export interface RegisteredUser {
  credentials: RegisterPayload;
  user: UserData;
}
