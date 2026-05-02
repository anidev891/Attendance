import { api } from './commonApi';
import { setCookie } from '../utils/cookies';
import { LoginResponse } from '../types';

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('auth/login', { username, password });

    if (response.status === 0 && response.data) {
      // Store token and user data in cookies
      setCookie('token', response.data.token, 7); // Store for 7 days
      setCookie('user', response.data.user, 7);
    }

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    throw error;
  }
};
