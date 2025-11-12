"use client";

import { Box, Chip } from "@mui/material";
import { FiltrosProducto } from "@/types/productos";

interface FiltrosActivosProps {
  filtros: FiltrosProducto;
  onEliminar: (key: keyof FiltrosProducto) => void;
  onLimpiarTodo: () => void;
}

export default function FiltrosActivos({
  filtros,
  onEliminar,
  onLimpiarTodo,
}: FiltrosActivosProps) {
  const filtrosArray = Object.entries(filtros).filter(
    ([_, value]) => value !== undefined && value !== null && value !== ""
  );

  if (filtrosArray.length === 0) return null;

  const getLabel = (key: string, value: any): string => {
    switch (key) {
      case "search":
        return `Búsqueda: "${value}"`;
      case "categoria":
        return `Categoría ID: ${value}`;
      case "marca":
        return `Marca: ${value}`;
      case "genero":
        return `Género: ${value}`;
      case "talla":
        return `Talla: ${value}`;
      case "precio_min":
        return `Precio mín: Bs. ${value}`;
      case "precio_max":
        return `Precio máx: Bs. ${value}`;
      default:
        return `${key}: ${value}`;
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
      {filtrosArray.map(([key, value]) => (
        <Chip
          key={key}
          label={getLabel(key, value)}
          onDelete={() => onEliminar(key as keyof FiltrosProducto)}
          size="small"
          color="primary"
          variant="outlined"
        />
      ))}
      {filtrosArray.length > 1 && (
        <Chip
          label="Limpiar todo"
          onClick={onLimpiarTodo}
          size="small"
          color="error"
          variant="outlined"
        />
      )}
    </Box>
  );
}
