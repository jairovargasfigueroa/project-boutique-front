"use client";
import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  Alert,
  Chip,
  LinearProgress,
} from "@mui/material";
import {
  IconTrendingUp,
  IconTrendingDown,
  IconMinus,
} from "@tabler/icons-react";
import { usePredictGeneral } from "@/hooks";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

const PrediccionesPage = () => {
  const [periodo, setPeriodo] = useState<"semanal" | "mensual">("semanal");
  const [cantidad, setCantidad] = useState(4);

  const { predicciones, loading, error, refetch } = usePredictGeneral({
    periodo,
    cantidad,
  });

  const handlePeriodoChange = (
    _event: React.MouseEvent<HTMLElement>,
    newPeriodo: "semanal" | "mensual" | null
  ) => {
    if (newPeriodo !== null) {
      setPeriodo(newPeriodo);
    }
  };

  const getTendenciaIcon = (tendencia: string) => {
    switch (tendencia) {
      case "alza":
        return <IconTrendingUp size={20} color="green" />;
      case "baja":
        return <IconTrendingDown size={20} color="red" />;
      default:
        return <IconMinus size={20} color="gray" />;
    }
  };

  const getTendenciaColor = (tendencia: string) => {
    switch (tendencia) {
      case "alza":
        return "success";
      case "baja":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <PageContainer
      title="Predicciones IA"
      description="Predicciones de ventas con Inteligencia Artificial"
    >
      <Box>
        <DashboardCard title="Predicciones de Ventas">
          <CardContent>
            {/* Controles */}
            <Box
              sx={{
                mb: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" color="textSecondary">
                Predicciones generadas con modelos de Machine Learning
              </Typography>
              <ToggleButtonGroup
                value={periodo}
                exclusive
                onChange={handlePeriodoChange}
                size="small"
                color="primary"
              >
                <ToggleButton value="semanal">Semanal</ToggleButton>
                <ToggleButton value="mensual">Mensual</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Loading */}
            {loading && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {/* Error */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Predicciones */}
            {!loading && !error && predicciones.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {predicciones.map((prediccion, index) => (
                  <Box
                    key={index}
                    sx={{ flex: "1 1 calc(25% - 16px)", minWidth: "250px" }}
                  >
                    <Card
                      variant="outlined"
                      sx={{
                        borderColor:
                          prediccion.tendencia === "alza"
                            ? "success.main"
                            : prediccion.tendencia === "baja"
                            ? "error.main"
                            : "grey.300",
                        borderWidth: 2,
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1,
                          }}
                        >
                          <Typography variant="caption" color="textSecondary">
                            {prediccion.periodo}
                          </Typography>
                          {getTendenciaIcon(prediccion.tendencia)}
                        </Box>

                        <Typography variant="h4" sx={{ mb: 1 }}>
                          Bs.{" "}
                          {parseFloat(prediccion.ventas_predichas).toFixed(2)}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ mb: 1 }}
                        >
                          ~{prediccion.cantidad_ventas_predichas} ventas
                        </Typography>

                        <Box sx={{ mb: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 0.5,
                            }}
                          >
                            <Typography variant="caption" color="textSecondary">
                              Confianza
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {(prediccion.confianza * 100).toFixed(0)}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={prediccion.confianza * 100}
                            color={
                              prediccion.confianza > 0.8 ? "success" : "warning"
                            }
                          />
                        </Box>

                        <Chip
                          label={prediccion.tendencia.toUpperCase()}
                          size="small"
                          color={getTendenciaColor(prediccion.tendencia) as any}
                          sx={{ width: "100%" }}
                        />
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            )}

            {/* Sin predicciones */}
            {!loading && !error && predicciones.length === 0 && (
              <Alert severity="info">
                No hay predicciones disponibles. El modelo necesita ser
                entrenado.
              </Alert>
            )}
          </CardContent>
        </DashboardCard>
      </Box>
    </PageContainer>
  );
};

export default PrediccionesPage;
