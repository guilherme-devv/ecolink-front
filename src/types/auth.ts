export type UserType = 'residential' | 'commercial';

export interface UserData {
  type: UserType;
  name: string;
  email: string;
  document: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  type: UserType;
  name: string;
  email: string;
  document: string;
}

export interface AuthContextType {
  user: UserData | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
