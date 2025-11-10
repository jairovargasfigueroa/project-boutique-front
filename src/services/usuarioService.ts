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
  getAll: async (): Promise<UsuarioListItem[]> => {
    const response = await apiClient.get<UsuarioListItem[]>(ENDPOINT);
    return response.data;
  },

  getById: async (id: number): Promise<User> => {
    const response = await apiClient.get<User>(`${ENDPOINT}${id}/`);
    return response.data;
  },

  getClientes: async (): Promise<UsuarioListItem[]> => {
    const usuarios = await usuarioService.getAll();
    return usuarios.filter((u) => u.rol === "cliente");
  },

  getVendedores: async (): Promise<UsuarioListItem[]> => {
    const usuarios = await usuarioService.getAll();
    return usuarios.filter((u) => u.rol === "vendedor");
  },

  crear: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.post<User>(ENDPOINT, data);
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
