'use client';

import { Box, Typography, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useCategorias } from '@/hooks/useCategorias';

interface FiltroCategoriasProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

export default function FiltroCategorias({ value, onChange }: FiltroCategoriasProps) {
  const { categorias, loading } = useCategorias();

  if (loading) {
    return (
      <Box>
        <Typography variant="subtitle2" fontWeight={600} mb={1}>
          Categorías
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Cargando...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} mb={1}>
        Categorías
      </Typography>
      <FormControl component="fieldset" fullWidth>
        <RadioGroup
          value={value || ''}
          onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
        >
          <FormControlLabel 
            value="" 
            control={<Radio size="small" />} 
            label="Todas" 
          />
          {categorias.map((categoria) => (
            <FormControlLabel 
              key={categoria.id}
              value={categoria.id} 
              control={<Radio size="small" />} 
              label={categoria.nombre} 
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
}
