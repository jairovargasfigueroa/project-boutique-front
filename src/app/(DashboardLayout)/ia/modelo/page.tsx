"use client";
import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Chip,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  IconCpu,
  IconRefresh,
  IconCheck,
  IconX,
  IconChartBar,
} from "@tabler/icons-react";
import {
  useModeloInfo,
  useTrainingHistory,
  useDetectarAnomalias,
} from "@/hooks";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

const ModeloPage = () => {
  const {
    modeloActivo,
    metricas,
    loading: loadingModelo,
    error: errorModelo,
    entrenarModelo,
    refetch,
  } = useModeloInfo();

  const {
    entrenamientos,
    loading: loadingHistory,
    error: errorHistory,
    refetch: refetchHistory,
  } = useTrainingHistory(5);

  const { detectar, loading: loadingDetectar } = useDetectarAnomalias();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [entrenando, setEntrenando] = useState(false);
  const [detectando, setDetectando] = useState(false);

  const handleEntrenar = async () => {
    setEntrenando(true);
    try {
      await entrenarModelo();
      setDialogOpen(false);
      refetch();
      refetchHistory();
    } catch (err) {
      console.error("Error al entrenar:", err);
    } finally {
      setEntrenando(false);
    }
  };

  const handleDetectar = async () => {
    setDetectando(true);
    try {
      const result = await detectar({ dias_analisis: 30 });
      alert(
        `Detección completada: ${result.cantidad_detectadas} anomalías detectadas`
      );
    } catch (err) {
      console.error("Error al detectar:", err);
    } finally {
      setDetectando(false);
    }
  };

  const getR2Color = (r2: number) => {
    if (r2 >= 0.85) return "success";
    if (r2 >= 0.7) return "warning";
    return "error";
  };

  const getR2Label = (r2: number) => {
    if (r2 >= 0.85) return "Excelente";
    if (r2 >= 0.7) return "Bueno";
    return "Necesita mejora";
  };

  return (
    <PageContainer
      title="Modelo de IA"
      description="Información y gestión del modelo de Machine Learning"
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Estado del Modelo */}
        <DashboardCard title="Estado del Modelo">
          <CardContent>
            {loadingModelo && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {errorModelo && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorModelo}
              </Alert>
            )}

            {!loadingModelo && !errorModelo && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <IconCpu size={40} />
                    <Box>
                      <Typography variant="h5">
                        {modeloActivo ? "Modelo Activo" : "Sin Modelo"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {metricas
                          ? `Versión ${metricas.version}`
                          : "No hay modelo entrenado"}
                      </Typography>
                    </Box>
                  </Box>

                  <Chip
                    icon={modeloActivo ? <IconCheck /> : <IconX />}
                    label={modeloActivo ? "Operativo" : "Inactivo"}
                    color={modeloActivo ? "success" : "error"}
                  />
                </Box>

                {metricas && (
                  <>
                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Métricas de Desempeño
                    </Typography>

                    {/* R² Score */}
                    <Box sx={{ mb: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2">
                          R² Score (Precisión)
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography variant="body2" fontWeight="bold">
                            {(metricas.r2_score * 100).toFixed(2)}%
                          </Typography>
                          <Chip
                            label={getR2Label(metricas.r2_score)}
                            size="small"
                            color={getR2Color(metricas.r2_score) as any}
                          />
                        </Box>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={metricas.r2_score * 100}
                        color={getR2Color(metricas.r2_score) as any}
                        sx={{ height: 8, borderRadius: 1 }}
                      />
                    </Box>

                    {/* Otras Métricas */}
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                        mb: 3,
                      }}
                    >
                      <Card
                        variant="outlined"
                        sx={{ flex: "1 1 calc(50% - 8px)" }}
                      >
                        <CardContent>
                          <Typography variant="body2" color="textSecondary">
                            MAE (Error Promedio)
                          </Typography>
                          <Typography variant="h6">
                            Bs. {metricas.mae.toFixed(2)}
                          </Typography>
                        </CardContent>
                      </Card>

                      <Card
                        variant="outlined"
                        sx={{ flex: "1 1 calc(50% - 8px)" }}
                      >
                        <CardContent>
                          <Typography variant="body2" color="textSecondary">
                            MSE (Error Cuadrático)
                          </Typography>
                          <Typography variant="h6">
                            {metricas.mse.toFixed(2)}
                          </Typography>
                        </CardContent>
                      </Card>

                      <Card
                        variant="outlined"
                        sx={{ flex: "1 1 calc(50% - 8px)" }}
                      >
                        <CardContent>
                          <Typography variant="body2" color="textSecondary">
                            Datos Entrenamiento
                          </Typography>
                          <Typography variant="h6">
                            {metricas.registros_entrenamiento}
                          </Typography>
                        </CardContent>
                      </Card>

                      <Card
                        variant="outlined"
                        sx={{ flex: "1 1 calc(50% - 8px)" }}
                      >
                        <CardContent>
                          <Typography variant="body2" color="textSecondary">
                            Datos Prueba
                          </Typography>
                          <Typography variant="h6">
                            {metricas.registros_prueba}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>

                    <Typography variant="body2" color="textSecondary">
                      Última actualización:{" "}
                      {new Date(metricas.fecha_entrenamiento).toLocaleString()}
                    </Typography>
                  </>
                )}

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Button
                    variant="contained"
                    startIcon={<IconRefresh />}
                    onClick={() => setDialogOpen(true)}
                    disabled={entrenando}
                  >
                    {entrenando ? "Entrenando..." : "Entrenar Modelo"}
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<IconChartBar />}
                    onClick={handleDetectar}
                    disabled={!modeloActivo || detectando}
                  >
                    {detectando ? "Detectando..." : "Detectar Anomalías"}
                  </Button>
                </Box>
              </>
            )}
          </CardContent>
        </DashboardCard>

        {/* Historial de Entrenamientos */}
        <DashboardCard title="Historial de Entrenamientos">
          <CardContent>
            {loadingHistory && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {errorHistory && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorHistory}
              </Alert>
            )}

            {!loadingHistory && !errorHistory && entrenamientos.length > 0 && (
              <List>
                {entrenamientos.map((entrenamiento) => (
                  <ListItem
                    key={entrenamiento.id}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                      mb: 1,
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="body1">
                            Versión {entrenamiento.version}
                          </Typography>
                          {entrenamiento.activo && (
                            <Chip label="Activo" size="small" color="success" />
                          )}
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="textSecondary">
                            {new Date(
                              entrenamiento.fecha_entrenamiento
                            ).toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            R²: {parseFloat(entrenamiento.r2_score).toFixed(4)}{" "}
                            | MAE: Bs.{" "}
                            {parseFloat(entrenamiento.mae).toFixed(2)}
                          </Typography>
                          {entrenamiento.notas && (
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              sx={{ mt: 0.5 }}
                            >
                              {entrenamiento.notas}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}

            {!loadingHistory &&
              !errorHistory &&
              entrenamientos.length === 0 && (
                <Alert severity="info">
                  No hay historial de entrenamientos.
                </Alert>
              )}
          </CardContent>
        </DashboardCard>

        {/* Dialog de confirmación */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Entrenar Modelo</DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
              El entrenamiento puede tomar varios minutos dependiendo de la
              cantidad de datos.
            </Alert>
            <Typography>
              ¿Estás seguro de que deseas entrenar el modelo? Esto reemplazará
              el modelo actual con uno nuevo entrenado con los datos más
              recientes.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button
              onClick={handleEntrenar}
              variant="contained"
              disabled={entrenando}
            >
              {entrenando ? <CircularProgress size={24} /> : "Entrenar"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PageContainer>
  );
};

export default ModeloPage;
