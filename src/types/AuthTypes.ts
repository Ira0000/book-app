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
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  signUp: (data: SignUpRequest) => Promise<void>;
  signIn: (data: SignInRequest) => Promise<void>;
  signOut: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => void;
}

export interface AuthStoreState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthStoreActions {
  signUp: (data: SignUpRequest) => Promise<void>;
  signIn: (data: SignInRequest) => Promise<void>;
  signOut: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => void;
  resetAuth: () => void;
  updateUser: (user: Partial<User>) => void;
  setError: (error: string) => void;
}

export type AuthStore = AuthStoreState & AuthStoreActions;

// Additional utility types for better type safety
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface AuthContextType {
  store: AuthStore;
  isInitialized: boolean;
}

export interface TokenPayload {
  sub: string;
  email: string;
  exp: number;
  iat: number;
}

export interface AuthConfig {
  apiBaseUrl: string;
  tokenKey: string;
  refreshTokenKey: string;
  enableAutoRefresh: boolean;
  refreshThreshold: number; // minutes before expiry to refresh
}
