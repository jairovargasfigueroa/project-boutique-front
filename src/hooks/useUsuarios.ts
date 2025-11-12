import { useState, useEffect } from 'react';
import { usuarioService, type UsuarioListItem } from '@/services/usuarioService';
import type { User } from '@/types/auth';

export const useUsuarios = (rol?: string) => {
  const [usuarios, setUsuarios] = useState<UsuarioListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usuarioService.getAll(rol);
      setUsuarios(data);
    } catch (err: any) {
      console.error('Error al cargar usuarios:', err);
      setError(err.response?.data?.error || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const crearUsuario = async (data: Partial<User>): Promise<User> => {
    try {
      const nuevoUsuario = await usuarioService.crear(data);
      await cargarUsuarios(); // Recargar lista después de crear
      return nuevoUsuario;
    } catch (err: any) {
      console.error('Error al crear usuario:', err);
      throw err;
    }
  };

  const actualizarUsuario = async (id: number, data: Partial<User>): Promise<User> => {
    try {
      const usuarioActualizado = await usuarioService.actualizar(id, data);
      await cargarUsuarios(); // Recargar lista después de actualizar
      return usuarioActualizado;
    } catch (err: any) {
      console.error('Error al actualizar usuario:', err);
      throw err;
    }
  };

  const eliminarUsuario = async (id: number): Promise<void> => {
    try {
      await usuarioService.eliminar(id);
      await cargarUsuarios(); // Recargar lista después de eliminar
    } catch (err: any) {
      console.error('Error al eliminar usuario:', err);
      throw err;
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, [rol]);

  return {
    usuarios,
    loading,
    error,
    refetch: cargarUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
  };
};

// Hook específico para clientes (usuarios con rol 'cliente')
export const useClientes = () => {
  const [clientes, setClientes] = useState<UsuarioListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usuarioService.getAll('cliente');
      setClientes(data);
    } catch (err: any) {
      console.error('Error al cargar clientes:', err);
      setError(err.response?.data?.error || 'Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  return {
    clientes,
    loading,
    error,
    refetch: cargarClientes,
  };
};
