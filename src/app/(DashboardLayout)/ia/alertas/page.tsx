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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  IconAlertTriangle,
  IconCheck,
  IconX,
  IconEye,
  IconEdit,
} from "@tabler/icons-react";
import { useAlertas } from "@/hooks";
import { EstadoAlerta, AlertaAnomalia } from "@/types/ia";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

const AlertasPage = () => {
  const [filtroEstado, setFiltroEstado] = useState<EstadoAlerta | "">("");
  const { alertas, loading, error, updateAlerta, refetch } = useAlertas({
    estado: filtroEstado || undefined,
    limite: 50,
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertaSeleccionada, setAlertaSeleccionada] =
    useState<AlertaAnomalia | null>(null);
  const [nuevoEstado, setNuevoEstado] = useState<EstadoAlerta>("revisada");
  const [notaResolucion, setNotaResolucion] = useState("");
  const [updating, setUpdating] = useState(false);

  const handleOpenDialog = (alerta: AlertaAnomalia) => {
    setAlertaSeleccionada(alerta);
    setNuevoEstado(alerta.estado);
    setNotaResolucion(alerta.nota_resolucion || "");
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setAlertaSeleccionada(null);
    setNotaResolucion("");
  };

  const handleUpdateAlerta = async () => {
    if (!alertaSeleccionada) return;

    setUpdating(true);
    try {
      await updateAlerta(alertaSeleccionada.id, {
        estado: nuevoEstado,
        nota_resolucion: notaResolucion || undefined,
      });
      handleCloseDialog();
      refetch();
    } catch (err) {
      console.error("Error al actualizar alerta:", err);
    } finally {
      setUpdating(false);
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "venta_baja":
        return "error";
      case "venta_alta":
        return "warning";
      case "producto_anomalo":
        return "info";
      case "tendencia_negativa":
        return "error";
      default:
        return "default";
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "nueva":
        return "error";
      case "revisada":
        return "warning";
      case "resuelta":
        return "success";
      case "ignorada":
        return "default";
      default:
        return "default";
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "nueva":
        return <IconAlertTriangle size={18} />;
      case "revisada":
        return <IconEye size={18} />;
      case "resuelta":
        return <IconCheck size={18} />;
      case "ignorada":
        return <IconX size={18} />;
      default:
        return null;
    }
  };

  return (
    <PageContainer
      title="Alertas de Anomalías"
      description="Alertas detectadas por el sistema de IA"
    >
      <Box>
        <DashboardCard title="Alertas de Anomalías">
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
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Filtrar por estado</InputLabel>
                <Select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value as any)}
                  label="Filtrar por estado"
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="nueva">Nuevas</MenuItem>
                  <MenuItem value="revisada">Revisadas</MenuItem>
                  <MenuItem value="resuelta">Resueltas</MenuItem>
                  <MenuItem value="ignorada">Ignoradas</MenuItem>
                </Select>
              </FormControl>

              <Typography variant="body2" color="textSecondary">
                {alertas.length} alerta{alertas.length !== 1 ? "s" : ""}
              </Typography>
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

            {/* Alertas */}
            {!loading && !error && alertas.length > 0 && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {alertas.map((alerta) => (
                  <Card
                    key={alerta.id}
                    variant="outlined"
                    sx={{
                      borderLeftWidth: 4,
                      borderLeftColor: `${getTipoColor(alerta.tipo)}.main`,
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <Chip
                              label={alerta.tipo_display}
                              size="small"
                              color={getTipoColor(alerta.tipo) as any}
                            />
                            <Chip
                              icon={getEstadoIcon(alerta.estado) || undefined}
                              label={alerta.estado_display}
                              size="small"
                              color={getEstadoColor(alerta.estado) as any}
                            />
                          </Box>

                          <Typography variant="h6" sx={{ mb: 1 }}>
                            {alerta.descripcion}
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              gap: 2,
                              flexWrap: "wrap",
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2" color="textSecondary">
                              📅 Fecha:{" "}
                              {new Date(
                                alerta.fecha_referencia
                              ).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              🔍 Detectado:{" "}
                              {new Date(
                                alerta.fecha_deteccion
                              ).toLocaleString()}
                            </Typography>
                            {alerta.producto_nombre && (
                              <Typography variant="body2" color="textSecondary">
                                📦 Producto: {alerta.producto_nombre}
                              </Typography>
                            )}
                          </Box>

                          <Box
                            sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}
                          >
                            <Typography
                              variant="body2"
                              color="error"
                              fontWeight="bold"
                            >
                              Real: Bs.{" "}
                              {parseFloat(alerta.valor_real).toFixed(2)}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Esperado: Bs.{" "}
                              {parseFloat(alerta.valor_esperado).toFixed(2)}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Score: {alerta.score_anomalia.toFixed(2)}
                            </Typography>
                          </Box>

                          {alerta.nota_resolucion && (
                            <Alert severity="info" sx={{ mt: 2 }}>
                              <Typography variant="body2">
                                <strong>Nota:</strong> {alerta.nota_resolucion}
                              </Typography>
                            </Alert>
                          )}
                        </Box>

                        <Tooltip title="Actualizar estado">
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenDialog(alerta)}
                          >
                            <IconEdit size={20} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}

            {/* Sin alertas */}
            {!loading && !error && alertas.length === 0 && (
              <Alert severity="success">
                No hay alertas
                {filtroEstado ? ` en estado "${filtroEstado}"` : ""}.
              </Alert>
            )}
          </CardContent>
        </DashboardCard>

        {/* Dialog para actualizar alerta */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Actualizar Alerta</DialogTitle>
          <DialogContent>
            <Box
              sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={nuevoEstado}
                  onChange={(e) =>
                    setNuevoEstado(e.target.value as EstadoAlerta)
                  }
                  label="Estado"
                >
                  <MenuItem value="revisada">Revisada</MenuItem>
                  <MenuItem value="resuelta">Resuelta</MenuItem>
                  <MenuItem value="ignorada">Ignorada</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Nota de Resolución"
                multiline
                rows={4}
                value={notaResolucion}
                onChange={(e) => setNotaResolucion(e.target.value)}
                placeholder="Describe la acción tomada o razón del cambio de estado..."
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button
              onClick={handleUpdateAlerta}
              variant="contained"
              disabled={updating}
            >
              {updating ? <CircularProgress size={24} /> : "Actualizar"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PageContainer>
  );
};

export default AlertasPage;
