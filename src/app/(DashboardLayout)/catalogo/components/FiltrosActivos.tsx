'use client';

import { Box, Chip, Typography } from '@mui/material';
import { FiltrosProducto } from '@/types/productos';
import { useCategorias } from '@/hooks/useCategorias';

interface FiltrosActivosProps {
  filtros: FiltrosProducto;
  onEliminar: (key: keyof FiltrosProducto) => void;
  onLimpiarTodo: () => void;
}

export default function FiltrosActivos({ 
  filtros, 
  onEliminar, 
  onLimpiarTodo 
}: FiltrosActivosProps) {
  const { categorias } = useCategorias();
  
  const filtrosActivos: Array<{ key: keyof FiltrosProducto; label: string }> = [];

  // Categoría (mostrar nombre en lugar de ID)
  if (filtros.categoria) {
    const categoria = categorias.find(c => c.id === filtros.categoria);
    if (categoria) {
      filtrosActivos.push({ key: 'categoria', label: `Categoría: ${categoria.nombre}` });
    }
  }

  // Marca
  if (filtros.marca) {
    filtrosActivos.push({ key: 'marca', label: `Marca: ${filtros.marca}` });
  }

  // Género
  if (filtros.genero) {
    const generoLabel = filtros.genero.charAt(0).toUpperCase() + filtros.genero.slice(1);
    filtrosActivos.push({ key: 'genero', label: `Género: ${generoLabel}` });
  }

  // Talla
  if (filtros.talla) {
    filtrosActivos.push({ key: 'talla', label: `Talla: ${filtros.talla}` });
  }

  // Precio
  if (filtros.precio_min !== undefined || filtros.precio_max !== undefined) {
    const min = filtros.precio_min || 0;
    const max = filtros.precio_max || 1000;
    filtrosActivos.push({ 
      key: 'precio_min', 
      label: `Precio: $${min} - $${max}` 
    });
  }

  if (filtrosActivos.length === 0) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        <Typography variant="body2" color="text.secondary">
          Filtros aplicados:
        </Typography>
        
        {filtrosActivos.map((filtro) => (
          <Chip
            key={filtro.key}
            label={filtro.label}
            size="small"
            onDelete={() => onEliminar(filtro.key)}
            color="primary"
            variant="outlined"
          />
        ))}
        
        {filtrosActivos.length > 1 && (
          <Chip
            label="Limpiar todo"
            size="small"
            onClick={onLimpiarTodo}
            color="secondary"
            variant="outlined"
          />
        )}
      </Box>
    </Box>
  );
}
