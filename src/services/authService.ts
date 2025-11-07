// src/services/authService.ts

import { apiClient } from './apiBase';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, User } from '@/types/auth';

const AUTH_ENDPOINT = '/usuarios';

export const authService = {
  /**
   * Iniciar sesión
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(`${AUTH_ENDPOINT}/login/`, credentials);
    return response.data;
  },

  /**
   * Registrar nuevo usuario
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>(`${AUTH_ENDPOINT}/register/`, data);
    return response.data;
  },

  /**
   * Verificar si el token es válido
   */
  verifyToken: async (): Promise<{ valid: boolean; user?: User }> => {
    try {
      const response = await apiClient.get<{ user: User }>(`${AUTH_ENDPOINT}/verify/`);
      return { valid: true, user: response.data.user };
    } catch (error) {
      return { valid: false };
    }
  },

  /**
   * Refrescar token (opcional, si tu backend lo soporta)
   */
  refreshToken: async (refreshToken: string): Promise<{ token: string }> => {
    const response = await apiClient.post<{ token: string }>(`${AUTH_ENDPOINT}/refresh/`, {
      refresh_token: refreshToken
    });
    return response.data;
  },

  /**
   * Obtener perfil del usuario actual
   */
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>(`${AUTH_ENDPOINT}/me/`);
    return response.data;
  },

  /**
   * Actualizar perfil
   */
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.put<User>(`${AUTH_ENDPOINT}/profile/`, data);
    return response.data;
  },

  /**
   * Cerrar sesión (opcional, si el backend necesita invalidar el token)
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post(`${AUTH_ENDPOINT}/logout/`);
    } catch (error) {
      // Ignorar errores en logout
      console.error('Error al cerrar sesión en el servidor:', error);
    }
  }
};
