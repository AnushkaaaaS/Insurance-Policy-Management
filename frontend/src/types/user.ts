export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "agent";
}

export interface LoginResponse {
  message: string;
  user: User;
}