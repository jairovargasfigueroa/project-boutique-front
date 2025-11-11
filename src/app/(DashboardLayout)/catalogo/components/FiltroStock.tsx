'use client';

import { Box, Typography, FormControlLabel, Checkbox } from '@mui/material';

interface FiltroStockProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function FiltroStock({ value, onChange }: FiltroStockProps) {
  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} mb={1}>
        Disponibilidad
      </Typography>
      
      <FormControlLabel
        control={
          <Checkbox
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
            size="small"
          />
        }
        label="Solo productos con stock"
      />
    </Box>
  );
}
