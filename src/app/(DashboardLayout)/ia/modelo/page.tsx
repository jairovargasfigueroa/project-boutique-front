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
      title="Modelo de Inteligencia Artificial"
      description="Gestiona y entrena el cerebro de las predicciones"
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Estado del Modelo */}
        <DashboardCard title="🤖 Estado del Modelo de IA">
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

                    <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
                      📊 ¿Qué tan preciso es el modelo?
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ mb: 3 }}
                    >
                      Estas métricas miden qué tan bien la IA predice las ventas
                      futuras
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
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            🎯 Precisión General del Modelo
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Mide qué tan bien predice (0% = malo, 100% =
                            perfecto)
                          </Typography>
                        </Box>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography variant="h6" fontWeight="bold">
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
                        sx={{ height: 10, borderRadius: 5 }}
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      fontWeight="medium"
                      sx={{ mb: 2 }}
                    >
                      📈 Métricas de Error (cuanto más bajo, mejor):
                    </Typography>

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
                          <Typography variant="caption" color="textSecondary">
                            💰 Error Promedio en Bolivianos (MAE)
                          </Typography>
                          <Typography variant="h6" sx={{ my: 1 }}>
                            Bs. {metricas.mae.toFixed(2)}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Diferencia promedio entre predicción y realidad
                          </Typography>
                        </CardContent>
                      </Card>

                      <Card
                        variant="outlined"
                        sx={{ flex: "1 1 calc(50% - 8px)" }}
                      >
                        <CardContent>
                          <Typography variant="caption" color="textSecondary">
                            📊 Error Cuadrático (MSE)
                          </Typography>
                          <Typography variant="h6" sx={{ my: 1 }}>
                            {metricas.mse.toFixed(2)}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Penaliza más los errores grandes
                          </Typography>
                        </CardContent>
                      </Card>

                      <Card
                        variant="outlined"
                        sx={{ flex: "1 1 calc(50% - 8px)" }}
                      >
                        <CardContent>
                          <Typography variant="caption" color="textSecondary">
                            🎓 Ventas usadas para Aprender
                          </Typography>
                          <Typography variant="h6" sx={{ my: 1 }}>
                            {metricas.registros_entrenamiento}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Datos históricos analizados por la IA
                          </Typography>
                        </CardContent>
                      </Card>

                      <Card
                        variant="outlined"
                        sx={{ flex: "1 1 calc(50% - 8px)" }}
                      >
                        <CardContent>
                          <Typography variant="caption" color="textSecondary">
                            ✅ Ventas usadas para Validar
                          </Typography>
                          <Typography variant="h6" sx={{ my: 1 }}>
                            {metricas.registros_prueba}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Datos reservados para comprobar precisión
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>

                    <Typography variant="body2" color="textSecondary">
                      🕒 Última actualización:{" "}
                      {new Date(metricas.fecha_entrenamiento).toLocaleString()}
                    </Typography>
                  </>
                )}

                <Divider sx={{ my: 3 }} />

                <Typography variant="body2" fontWeight="medium" sx={{ mb: 2 }}>
                  ⚙️ Acciones disponibles:
                </Typography>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Button
                    variant="contained"
                    startIcon={<IconRefresh />}
                    onClick={() => setDialogOpen(true)}
                    disabled={entrenando}
                  >
                    {entrenando ? "Entrenando..." : "🔄 Entrenar Modelo"}
                  </Button>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ alignSelf: "center", maxWidth: 300 }}
                  >
                    Actualiza la IA con las ventas más recientes para mejorar
                    las predicciones
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<IconChartBar />}
                    onClick={handleDetectar}
                    disabled={!modeloActivo || detectando}
                  >
                    {detectando ? "Detectando..." : "🔍 Detectar Anomalías"}
                  </Button>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ alignSelf: "center", maxWidth: 300 }}
                  >
                    Busca ventas sospechosas o inusuales en los últimos 30 días
                  </Typography>
                </Box>
              </>
            )}
          </CardContent>
        </DashboardCard>

        {/* Historial de Entrenamientos */}
        <DashboardCard title="📜 Historial de Entrenamientos">
          <CardContent>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Registro de todos los entrenamientos realizados. Cada vez que
              entrenas, la IA aprende de tus nuevas ventas.
            </Typography>

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
                      bgcolor: entrenamiento.activo
                        ? "success.lighter"
                        : "transparent",
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
                          <Typography variant="body1" fontWeight="medium">
                            🤖 Modelo Versión {entrenamiento.version}
                          </Typography>
                          {entrenamiento.activo && (
                            <Chip
                              label="✅ Activo"
                              size="small"
                              color="success"
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box component="span" sx={{ display: "block" }}>
                          <Box component="span" sx={{ display: "block", mt: 1 }}>
                            📅 Entrenado el:{" "}
                            {new Date(
                              entrenamiento.fecha_entrenamiento
                            ).toLocaleString()}
                          </Box>
                          <Box component="span" sx={{ display: "block" }}>
                            🎯 Precisión:{" "}
                            {(parseFloat(entrenamiento.r2_score) * 100).toFixed(
                              2
                            )}
                            % | 💰 Error Promedio: Bs.{" "}
                            {parseFloat(entrenamiento.mae).toFixed(2)}
                          </Box>
                          {entrenamiento.notas && (
                            <Box
                              component="span"
                              sx={{ display: "block", mt: 0.5, fontStyle: "italic" }}
                            >
                              📝 {entrenamiento.notas}
                            </Box>
                          )}
                        </Box>
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
                  ℹ️ No hay historial de entrenamientos. Entrena el modelo por
                  primera vez para empezar a ver predicciones.
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
