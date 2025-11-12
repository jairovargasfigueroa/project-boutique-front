"use client";

import { Box, Typography, FormControl, Select, MenuItem } from "@mui/material";

interface FiltroMarcaProps {
  value: string;
  onChange: (value: string) => void;
}

const MARCAS_COMUNES = [
  "Nike",
  "Adidas",
  "Puma",
  "Zara",
  "H&M",
  "Levi's",
  "Gucci",
  "Tommy Hilfiger",
  "Calvin Klein",
  "Gap",
  "Uniqlo",
  "Forever 21",
];

export default function FiltroMarca({ value, onChange }: FiltroMarcaProps) {
  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} mb={1}>
        Marca
      </Typography>
      <FormControl fullWidth size="small">
        <Select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">Todas</MenuItem>
          {MARCAS_COMUNES.map((marca) => (
            <MenuItem key={marca} value={marca}>
              {marca}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
