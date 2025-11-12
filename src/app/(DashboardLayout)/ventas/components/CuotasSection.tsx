"use client";
import { Box, Typography, Card, CardContent, Chip, Alert } from "@mui/material";
import { useCuotasAlertas } from "@/hooks/useCuotas";

const CuotasSection = () => {
  const { proximasVencer, vencidas, loading } = useCuotasAlertas();

  if (loading) {
    return (
      <Box p={2}>
        <Typography variant="body2" color="text.secondary">
          Cargando alertas...
        </Typography>
      </Box>
    );
  }

  if (vencidas.length === 0 && proximasVencer.length === 0) {
    return null; // No mostrar nada si no hay alertas
  }

  return <Box mb={3}></Box>;
};

export default CuotasSection;
