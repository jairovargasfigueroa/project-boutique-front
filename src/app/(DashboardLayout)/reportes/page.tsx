"use client";
import { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
} from "@mui/material";
import {
  IconReceipt,
  IconPackage,
  IconAlertTriangle,
  IconTrendingUp,
  IconCash,
  IconCalendar,
  IconUserExclamation,
  IconChartLine,
} from "@tabler/icons-react";
import PageContainer from "../components/container/PageContainer";
import { useReportes } from "@/hooks";
import ReporteTabla from "./components/ReporteTabla";
import ConsultaNatural from "./components/ConsultaNatural";
import type { ReportType } from "@/types/reportes.types";

interface PresetReport {
  tipo: ReportType;
  titulo: string;
  descripcion: string;
  Icon: any;
  filtros?: Record<string, any>;
}

const reportesPreconfigurados: PresetReport[] = [
  {
    tipo: "ventas",
    titulo: "Ventas del Mes",
    descripcion: "Reporte de todas las ventas",
    Icon: IconReceipt,
  },
  {
    tipo: "productos",
    titulo: "Productos",
    descripcion: "Listado de productos",
    Icon: IconPackage,
  },
  {
    tipo: "stock_bajo",
    titulo: "Stock Bajo",
    descripcion: "Productos con stock crítico",
    Icon: IconAlertTriangle,
  },
  {
    tipo: "mas_vendidos",
    titulo: "Más Vendidos",
    descripcion: "Productos más vendidos",
    Icon: IconTrendingUp,
  },
  {
    tipo: "pagos",
    titulo: "Pagos Realizados",
    descripcion: "Historial de pagos",
    Icon: IconCash,
  },
  {
    tipo: "cuotas",
    titulo: "Cuotas Pendientes",
    descripcion: "Cuotas por cobrar",
    Icon: IconCalendar,
  },
  {
    tipo: "morosidad",
    titulo: "Morosidad",
    descripcion: "Análisis de cuotas vencidas",
    Icon: IconUserExclamation,
  },
  {
    tipo: "flujo_caja",
    titulo: "Flujo de Caja",
    descripcion: "Ingresos y egresos",
    Icon: IconChartLine,
  },
];

const ReportesPage = () => {
  const { reporte, loading, error, generarReporte, consultaNatural } =
    useReportes();
  const [reporteActual, setReporteActual] = useState<string>("");

  const handlePresetReport = async (preset: PresetReport) => {
    setReporteActual(preset.titulo);
    await generarReporte(preset.tipo, preset.filtros);
  };

  const handleConsultaNatural = async (query: string) => {
    setReporteActual(`Consulta: "${query}"`);
    await consultaNatural(query);
  };

  return (
    <PageContainer
      title="Reportes"
      description="Reportes y análisis del sistema"
    >
      <Box>
        {/* Consulta Natural */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" mb={2}>
              Consulta en Lenguaje Natural
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Realiza consultas usando lenguaje natural o usa el micrófono para
              dictar tu consulta
            </Typography>
            <ConsultaNatural
              onQuery={handleConsultaNatural}
              loading={loading}
            />
          </CardContent>
        </Card>

        {/* Reportes Preconfigurados */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" mb={2}>
              Reportes Preconfigurados
            </Typography>
            <Grid container spacing={2}>
              {reportesPreconfigurados.map((preset) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={preset.tipo}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handlePresetReport(preset)}
                    disabled={loading}
                    sx={{
                      height: "100%",
                      flexDirection: "column",
                      gap: 1,
                      py: 2,
                      textAlign: "center",
                    }}
                  >
                    <preset.Icon size={32} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {preset.titulo}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {preset.descripcion}
                      </Typography>
                    </Box>
                  </Button>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Resultado */}
        {reporteActual && (
          <Card>
            <CardContent>
              <Typography variant="h5" mb={2}>
                {reporteActual}
              </Typography>
              <ReporteTabla reporte={reporte} loading={loading} />
            </CardContent>
          </Card>
        )}
      </Box>
    </PageContainer>
  );
};

export default ReportesPage;
