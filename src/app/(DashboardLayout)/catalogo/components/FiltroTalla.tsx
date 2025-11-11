'use client';

import { Box, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';

interface FiltroTallaProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

const tallas = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

export default function FiltroTalla({ value, onChange }: FiltroTallaProps) {
  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} mb={1}>
        Talla
      </Typography>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={(_, newValue) => onChange(newValue)}
        aria-label="talla"
        sx={{ flexWrap: 'wrap', gap: 1 }}
      >
        {tallas.map((talla) => (
          <ToggleButton 
            key={talla} 
            value={talla}
            sx={{ 
              px: 2, 
              py: 0.5,
              minWidth: 45,
              textTransform: 'none'
            }}
          >
            {talla}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
