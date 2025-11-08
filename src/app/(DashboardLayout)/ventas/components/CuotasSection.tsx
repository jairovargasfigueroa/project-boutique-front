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

  return (
    <Box mb={3}>
      <Typography variant="h5" mb={2}>
        🔔 Alertas de Cuotas
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        {/* Cuotas Vencidas */}
        {vencidas.length > 0 && (
          <Alert severity="error" variant="filled">
            <Typography variant="body2" fontWeight={600}>
              🔴 Tienes {vencidas.length} cuota{vencidas.length > 1 ? "s" : ""}{" "}
              vencida{vencidas.length > 1 ? "s" : ""}
            </Typography>
            <Typography variant="caption">
              Total adeudado: Bs{" "}
              {vencidas
                .reduce((sum, c) => sum + parseFloat(c.monto_cuota), 0)
                .toFixed(2)}
            </Typography>
          </Alert>
        )}

        {/* Cuotas Próximas a Vencer */}
        {proximasVencer.length > 0 && (
          <Alert severity="warning" variant="filled">
            <Typography variant="body2" fontWeight={600}>
              ⚠️ {proximasVencer.length} cuota{proximasVencer.length > 1 ? "s" : ""}{" "}
              vence{proximasVencer.length > 1 ? "n" : ""} esta semana
            </Typography>
            <Typography variant="caption">
              Total próximo: Bs{" "}
              {proximasVencer
                .reduce((sum, c) => sum + parseFloat(c.monto_cuota), 0)
                .toFixed(2)}
            </Typography>
          </Alert>
        )}

        {/* Resumen en Cards */}
        <Box display="flex" gap={2} flexWrap="wrap">
          {vencidas.length > 0 && (
            <Card sx={{ flex: 1, minWidth: 200, bgcolor: "error.light" }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h3" color="error.dark">
                      {vencidas.length}
                    </Typography>
                    <Typography variant="body2" color="error.dark">
                      Vencidas
                    </Typography>
                  </Box>
                  <Typography variant="h4" color="error.dark">
                    🔴
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}

          {proximasVencer.length > 0 && (
            <Card sx={{ flex: 1, minWidth: 200, bgcolor: "warning.light" }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h3" color="warning.dark">
                      {proximasVencer.length}
                    </Typography>
                    <Typography variant="body2" color="warning.dark">
                      Por vencer
                    </Typography>
                  </Box>
                  <Typography variant="h4" color="warning.dark">
                    ⚠️
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CuotasSection;
