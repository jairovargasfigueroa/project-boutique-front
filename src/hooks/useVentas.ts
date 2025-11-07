'use client';
import { useState } from 'react';
import { ventaService } from '@/services/ventaService';
import { CrearVentaData, Venta } from '@/types/ventas';

export const useVentas = () => {
  const [venta, setVenta] = useState<Venta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearVenta = async (data: CrearVentaData) => {
    try {
      setLoading(true);
      setError(null);
      const nuevaVenta = await ventaService.crear(data);
      console.log('Venta creada:', nuevaVenta);
      setVenta(nuevaVenta);
      return nuevaVenta;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al crear venta';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const obtenerVenta = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ventaService.getById(id);
      setVenta(data);
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al obtener venta';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    venta,
    loading,
    error,
    crearVenta,
    obtenerVenta
  };
};
