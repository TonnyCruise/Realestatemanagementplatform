import { api } from './api';

export type Role = 'LANDLORD' | 'TENANT' | 'SEEKER' | 'ADMIN';
export type Country = 'KE' | 'TZ' | 'UG';

export interface User {
  id: string;
  phone: string;
  email?: string;
  firstName: string;
  lastName: string;
  role: Role;
  country: Country;
  isVerified: boolean;
  profilePhoto?: string;
  subscriptionId?: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterDto {
  phone: string;
  email?: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
  country: Country;
}

export interface LoginDto {
  identifier: string;
  password: string;
}

export async function register(dto: RegisterDto): Promise<AuthTokens> {
  const { data } = await api.post<AuthTokens>('/auth/register', dto);
  storeTokens(data);
  return data;
}

export async function login(dto: LoginDto): Promise<AuthTokens> {
  const { data } = await api.post<AuthTokens>('/auth/login', dto);
  storeTokens(data);
  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>('/auth/me');
  return data;
}

export async function logout(): Promise<void> {
  clearTokens();
}

export function storeTokens(tokens: AuthTokens) {
  localStorage.setItem('accessToken', tokens.accessToken);
  localStorage.setItem('refreshToken', tokens.refreshToken);
}

export function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('accessToken');
}
