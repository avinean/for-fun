export interface AuthRequest {
  email: string;
  pass: string;
}

export interface AuthResponse {
  token: string;
}

export interface User {
  id: number;
  email: string;
  nickname: string;
  name: string;
  last_name: string;
  age: number;
  hash: string;
  photo: string;
  created_at: string;
  updated_at: string;
}

export interface QueryOptions {
  params?: Record<string, any>;
  query?: Record<string, any>;
}