'use client';

import { 
  Box, 
  Typography, 
  Divider, 
  Button,
  Paper
} from '@mui/material';
import { FiltrosProducto } from '@/types/productos';
import FiltroCategorias from './FiltroCategorias';
import FiltroMarca from './FiltroMarca';
import FiltroGenero from './FiltroGenero';
import FiltroTalla from './FiltroTalla';
import FiltroPrecio from './FiltroPrecio';

interface FiltrosSidebarProps {
  filtros: FiltrosProducto;
  onChange: (filtros: FiltrosProducto) => void;
  onLimpiar: () => void;
}

export default function FiltrosSidebar({ 
  filtros, 
  onChange, 
  onLimpiar 
}: FiltrosSidebarProps) {
  
  const handleChange = (key: keyof FiltrosProducto, value: any) => {
    onChange({ ...filtros, [key]: value });
  };

  const tienesFiltrosActivos = Object.values(filtros).some(v => 
    v !== undefined && v !== null && v !== ''
  );

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2, 
        position: 'sticky', 
        top: 20,
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={600}>
          Filtros
        </Typography>
        {tienesFiltrosActivos && (
          <Button 
            size="small" 
            onClick={onLimpiar}
            sx={{ textTransform: 'none' }}
          >
            Limpiar todo
          </Button>
        )}
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Categorías */}
      <FiltroCategorias
        value={filtros.categoria || null}
        onChange={(value: number | null) => handleChange('categoria', value)}
      />

      <Divider sx={{ my: 2 }} />

      {/* Marca */}
      <FiltroMarca
        value={filtros.marca || ''}
        onChange={(value: string) => handleChange('marca', value)}
      />

      <Divider sx={{ my: 2 }} />

      {/* Género */}
      <FiltroGenero
        value={filtros.genero || null}
        onChange={(value: 'Hombre' | 'Mujer' | 'Unisex' | null) => handleChange('genero', value)}
      />

      <Divider sx={{ my: 2 }} />

      {/* Talla */}
      <FiltroTalla
        value={filtros.talla || null}
        onChange={(value: string | null) => handleChange('talla', value)}
      />

      <Divider sx={{ my: 2 }} />

      {/* Precio */}
      <FiltroPrecio
        min={filtros.precio_min || 0}
        max={filtros.precio_max || 1000}
        onChange={(min: number, max: number) => {
          onChange({ 
            ...filtros, 
            precio_min: min, 
            precio_max: max 
          });
        }}
      />
    </Paper>
  );
}
