export interface AuthRequest {
  email: string;
  pass: string;
}

export interface AuthResponse {
  token: string;
}

export interface RegistrationRequest {
  id: number;
  email: string;
  nickname: string;
  name: string;
  lastName: string;
  age: number;
  photo: string;
  pass: string;
  confirmPass: string;
}
