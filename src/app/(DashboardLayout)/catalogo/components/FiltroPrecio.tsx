'use client';

import { Box, Typography, Slider } from '@mui/material';
import { useState } from 'react';

interface FiltroPrecioProps {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
}

export default function FiltroPrecio({ min, max, onChange }: FiltroPrecioProps) {
  const [range, setRange] = useState<number[]>([min, max]);

  const handleChange = (_: Event, newValue: number | number[]) => {
    setRange(newValue as number[]);
  };

  const handleChangeCommitted = (_: Event | React.SyntheticEvent, newValue: number | number[]) => {
    const [newMin, newMax] = newValue as number[];
    onChange(newMin, newMax);
  };

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} mb={1}>
        Precio
      </Typography>
      
      <Box sx={{ px: 1 }}>
        <Slider
          value={range}
          onChange={handleChange}
          onChangeCommitted={handleChangeCommitted}
          valueLabelDisplay="auto"
          min={0}
          max={2000}
          step={10}
          valueLabelFormat={(value) => `$${value}`}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          ${range[0]}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ${range[1]}
        </Typography>
      </Box>
    </Box>
  );
}
