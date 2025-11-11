'use client';

import { Box, Typography, TextField } from '@mui/material';

interface FiltroColorProps {
  value: string;
  onChange: (value: string) => void;
}

const coloresComunes = [
  { nombre: 'Negro', hex: '#000000' },
  { nombre: 'Blanco', hex: '#FFFFFF' },
  { nombre: 'Rojo', hex: '#FF0000' },
  { nombre: 'Azul', hex: '#0000FF' },
  { nombre: 'Verde', hex: '#00FF00' },
  { nombre: 'Amarillo', hex: '#FFFF00' },
  { nombre: 'Gris', hex: '#808080' },
  { nombre: 'Rosa', hex: '#FFC0CB' },
];

export default function FiltroColor({ value, onChange }: FiltroColorProps) {
  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} mb={1}>
        Color
      </Typography>
      
      {/* Círculos de colores */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
        {coloresComunes.map((color) => (
          <Box
            key={color.nombre}
            onClick={() => onChange(value === color.nombre ? '' : color.nombre)}
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: color.hex,
              border: '2px solid',
              borderColor: value === color.nombre ? 'primary.main' : 'divider',
              cursor: 'pointer',
              boxShadow: value === color.nombre ? 2 : 0,
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: 2
              }
            }}
            title={color.nombre}
          />
        ))}
      </Box>

      {/* Input de texto para otros colores */}
      <TextField
        fullWidth
        size="small"
        placeholder="O escribe un color..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Box>
  );
}
