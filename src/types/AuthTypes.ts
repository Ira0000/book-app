export interface AuthResponse {
  email: string;
  name: string;
  token: string;
  refreshToken: string;
}

export interface SignUpRequest {
  email: string;
  name: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  token?: string;
  refreshToken?: string;
}

export interface AuthState {
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  user: User | null;
  initializeAuth: () => Promise<void>;
  signIn: (data: SignInRequest) => Promise<AuthResponse>;
  signUp: (data: SignUpRequest) => Promise<AuthResponse>;
  refreshAccessToken: () => Promise<{ token: string; refreshToken: string }>;
  signOut: () => Promise<void>;
}
