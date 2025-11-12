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
      title="Predicciones de Ventas con IA"
      description="¿Cuánto venderás en el futuro? La IA te lo predice"
    >
      <Box>
        <DashboardCard title="🔮 Predicciones Inteligentes de Ventas">
          <CardContent>
            {/* Controles */}
            <Box
              sx={{
                mb: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="body1" fontWeight="medium" sx={{ mb: 0.5 }}>
                  Predicciones generadas por Inteligencia Artificial
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Selecciona el periodo para ver las predicciones semanales o mensuales
                </Typography>
              </Box>
              <ToggleButtonGroup
                value={periodo}
                exclusive
                onChange={handlePeriodoChange}
                size="small"
                color="primary"
              >
                <ToggleButton value="semanal">📅 Semanal</ToggleButton>
                <ToggleButton value="mensual">📆 Mensual</ToggleButton>
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
              <>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                  📊 Predicciones de Ventas Futuras
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                  La Inteligencia Artificial analiza tus ventas pasadas y predice cuánto
                  venderás en las próximas semanas o meses. Cada cuadro representa un
                  periodo de tiempo futuro.
                </Typography>
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
                          height: "100%",
                        }}
                      >
                        <CardContent>
                          {/* Encabezado con periodo */}
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 2,
                              pb: 1,
                              borderBottom: "1px solid",
                              borderColor: "divider",
                            }}
                          >
                            <Typography variant="h6" fontWeight="bold">
                              {prediccion.periodo}
                            </Typography>
                            {getTendenciaIcon(prediccion.tendencia)}
                          </Box>

                          {/* Monto predicho - Destacado */}
                          <Box sx={{ mb: 2 }}>
                            <Typography
                              variant="caption"
                              color="textSecondary"
                              sx={{ display: "block", mb: 0.5 }}
                            >
                              💰 Ventas Estimadas:
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                              Bs.{" "}
                              {parseFloat(prediccion.ventas_predichas).toFixed(2)}
                            </Typography>
                          </Box>

                          {/* Cantidad de ventas */}
                          <Box sx={{ mb: 2 }}>
                            <Typography
                              variant="caption"
                              color="textSecondary"
                              sx={{ display: "block", mb: 0.5 }}
                            >
                              🛒 Número de Transacciones:
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              ~{prediccion.cantidad_ventas_predichas} ventas
                            </Typography>
                          </Box>

                          {/* Barra de confianza */}
                          <Box sx={{ mb: 2 }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 0.5,
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                📈 Nivel de Confianza de la IA:
                              </Typography>
                              <Typography
                                variant="caption"
                                fontWeight="bold"
                                color={
                                  prediccion.confianza > 0.8
                                    ? "success.main"
                                    : "warning.main"
                                }
                              >
                                {(prediccion.confianza * 100).toFixed(0)}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={prediccion.confianza * 100}
                              color={
                                prediccion.confianza > 0.8 ? "success" : "warning"
                              }
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                            <Typography
                              variant="caption"
                              color="textSecondary"
                              sx={{ display: "block", mt: 0.5, fontSize: "0.7rem" }}
                            >
                              {prediccion.confianza > 0.8
                                ? "Alta precisión en la predicción"
                                : "Precisión moderada, usar como referencia"}
                            </Typography>
                          </Box>

                          {/* Chip de tendencia */}
                          <Chip
                            label={
                              prediccion.tendencia === "alza"
                                ? "📈 TENDENCIA AL ALZA"
                                : prediccion.tendencia === "baja"
                                ? "📉 TENDENCIA A LA BAJA"
                                : "➡️ TENDENCIA ESTABLE"
                            }
                            size="small"
                            color={getTendenciaColor(prediccion.tendencia) as any}
                            sx={{ width: "100%", fontWeight: "bold" }}
                          />
                        </CardContent>
                      </Card>
                    </Box>
                  ))}
                </Box>
              </>
            )}

            {/* Sin predicciones */}
            {!loading && !error && predicciones.length === 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body1" fontWeight="medium" sx={{ mb: 1 }}>
                  ℹ️ No hay predicciones disponibles
                </Typography>
                <Typography variant="body2">
                  Para ver predicciones de ventas futuras, primero debes entrenar el
                  modelo de Inteligencia Artificial. Ve a la sección &quot;Modelo de IA&quot; y
                  haz clic en &quot;Entrenar Modelo&quot;.
                </Typography>
              </Alert>
            )}
          </CardContent>
        </DashboardCard>
      </Box>
    </PageContainer>
  );
};

export default PrediccionesPage;
