'use client';
import { useState } from 'react';
import { pagoService } from '@/services/pagoService';
import { CrearPagoData, Pago } from '@/types/pagos';

export const usePagos = () => {
  const [pago, setPago] = useState<Pago | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registrarPago = async (data: CrearPagoData) => {
    try {
      setLoading(true);
      setError(null);
      const nuevoPago = await pagoService.crear(data);
      console.log('Pago registrado:', nuevoPago);
      setPago(nuevoPago);
      return nuevoPago;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al registrar pago';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const obtenerPago = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await pagoService.getById(id);
      setPago(data);
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al obtener pago';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    pago,
    loading,
    error,
    registrarPago,
    obtenerPago
  };
};
