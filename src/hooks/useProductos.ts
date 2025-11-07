// src/hooks/useProductos.ts
'use client';
import { productoService } from '@/services/productoService';
import { Producto, ProductoVariante } from '@/types/productos';
import { useState, useEffect } from 'react';



export const useProductos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [variantes, setVariantes] = useState<ProductoVariante[]>([]);
  const [loadingVariantes, setLoadingVariantes] = useState(false);

  // Cargar productos
  const fetchProductos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productoService.getAll();
      console.log('Productos',data)
      setProductos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  // Crear producto
  const createProducto = async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      const newProduct = await productoService.create(data);
      // Actualizar la lista local
      setProductos(prev => [...prev, newProduct]);
      return newProduct;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear producto');
      throw err; // Re-lanzar para manejar en el componente si es necesario
    } finally {
      setLoading(false);
    }
  };

  // Actualizar producto
  const updateProducto = async (id: number, data: any) => {
    try {
      setLoading(true);
      setError(null);
      const updatedProduct = await productoService.update(id, data);
      // Actualizar la lista local
      setProductos(prev => 
        prev.map(prod => prod.id === id ? updatedProduct : prod)
      );
      return updatedProduct;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar producto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar producto
  const deleteProducto = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await productoService.delete(id);
      // Actualizar la lista local
      setProductos(prev => prev.filter(prod => prod.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar producto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Obtener variantes de un producto
  const fetchVariantes = async (productoId: number) => {
    try {
      setLoadingVariantes(true);
      setError(null);
      const data = await productoService.getVariantesByProducto(productoId);
      console.log('Variantes del producto', productoId, data);
      setVariantes(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar variantes');
      throw err;
    } finally {
      setLoadingVariantes(false);
    }
  };

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProductos();
  }, []);

  return {
    // Estado
    productos,
    loading,
    error,
    variantes,
    loadingVariantes,
    
    // Acciones
    createProducto,
    updateProducto,
    deleteProducto,
    refetch: fetchProductos,
    fetchVariantes
  };
};