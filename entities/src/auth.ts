export interface AuthRequest {
  email: string;
  pass: string;
}

export interface AuthResponse {
  token: string;
}

export interface RegistrationRequest {
  email: string;
  nickname: string;
  pass: string;
  confirmPass: string;
}
