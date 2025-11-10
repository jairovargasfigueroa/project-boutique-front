import { useState, useEffect } from 'react';
import { usuarioService, type UsuarioListItem } from '@/services/usuarioService';

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<UsuarioListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usuarioService.getAll();
      setUsuarios(data);
    } catch (err: any) {
      console.error('Error al cargar usuarios:', err);
      setError(err.response?.data?.error || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  return {
    usuarios,
    loading,
    error,
    refetch: cargarUsuarios,
  };
};

export const useClientes = () => {
  const [clientes, setClientes] = useState<UsuarioListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usuarioService.getClientes();
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

export const useVendedores = () => {
  const [vendedores, setVendedores] = useState<UsuarioListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarVendedores = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usuarioService.getVendedores();
      setVendedores(data);
    } catch (err: any) {
      console.error('Error al cargar vendedores:', err);
      setError(err.response?.data?.error || 'Error al cargar vendedores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarVendedores();
  }, []);

  return {
    vendedores,
    loading,
    error,
    refetch: cargarVendedores,
  };
};
