"use client";

import {
  Box,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

interface FiltroGeneroProps {
  value: "Hombre" | "Mujer" | "Unisex" | null;
  onChange: (value: "Hombre" | "Mujer" | "Unisex" | null) => void;
}

export default function FiltroGenero({ value, onChange }: FiltroGeneroProps) {
  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} mb={1}>
        Género
      </Typography>
      <FormControl component="fieldset">
        <RadioGroup
          value={value || ""}
          onChange={(e) => onChange((e.target.value as any) || null)}
        >
          <FormControlLabel
            value=""
            control={<Radio size="small" />}
            label="Todos"
          />
          <FormControlLabel
            value="Hombre"
            control={<Radio size="small" />}
            label="Hombre"
          />
          <FormControlLabel
            value="Mujer"
            control={<Radio size="small" />}
            label="Mujer"
          />
          <FormControlLabel
            value="Unisex"
            control={<Radio size="small" />}
            label="Unisex"
          />
        </RadioGroup>
      </FormControl>
    </Box>
  );
}
