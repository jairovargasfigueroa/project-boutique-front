import { apiClient } from "./apiBase";
import type { User } from "@/types/auth";

const ENDPOINT = "/usuarios/";

export interface UsuarioListItem {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  rol: "admin" | "vendedor" | "cliente";
  telefono?: string;
}

export const usuarioService = {
  getAll: async (rol?: string): Promise<UsuarioListItem[]> => {
    const url = rol ? `${ENDPOINT}?rol=${rol}` : ENDPOINT;
    console.log('🔵 [usuarioService.getAll] Parámetro rol recibido:', rol);
    console.log('🔵 [usuarioService.getAll] URL enviada al backend:', url);
    const response = await apiClient.get<UsuarioListItem[]>(url);
    console.log('🟢 [usuarioService.getAll] Respuesta del backend:', response.data);
    return response.data;
  },

  getById: async (id: number): Promise<User> => {
    const response = await apiClient.get<User>(`${ENDPOINT}${id}/`);
    return response.data;
  },

  crear: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.post<User>(`${ENDPOINT}registro/`, data);
    return response.data;
  },

  actualizar: async (id: number, data: Partial<User>): Promise<User> => {
    const response = await apiClient.patch<User>(`${ENDPOINT}${id}/`, data);
    return response.data;
  },

  eliminar: async (id: number): Promise<void> => {
    await apiClient.delete(`${ENDPOINT}${id}/`);
  },

  formatearNombreCompleto: (usuario: UsuarioListItem | User): string => {
    if (usuario.first_name || usuario.last_name) {
      return `${usuario.first_name} ${usuario.last_name}`.trim();
    }
    return usuario.username;
  },
};
