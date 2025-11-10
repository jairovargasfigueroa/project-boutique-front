"use client";
import { Grid, Box, CircularProgress, Alert, Typography } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import { useDashboard } from "@/hooks";

// Componentes del dashboard
import ResumenCards from "@/app/(DashboardLayout)/components/dashboard/ResumenCards";
import VentasSemanales from "@/app/(DashboardLayout)/components/dashboard/VentasSemanales";
import IngresosPorMetodo from "@/app/(DashboardLayout)/components/dashboard/IngresosPorMetodo";
import TopProductos from "@/app/(DashboardLayout)/components/dashboard/TopProductos";
import TopClientes from "@/app/(DashboardLayout)/components/dashboard/TopClientes";
import StockCriticoTable from "@/app/(DashboardLayout)/components/dashboard/StockCriticoTable";
import ConsultaNaturalDashboard from "@/app/(DashboardLayout)/components/dashboard/ConsultaNaturalDashboard";

const Dashboard = () => {
  const { data, loading, error } = useDashboard();

  if (loading) {
    return (
      <PageContainer title="Dashboard" description="Panel de control principal">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress size={60} />
        </Box>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Dashboard" description="Panel de control principal">
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6">Error al cargar el dashboard</Typography>
          <Typography variant="body2">{error}</Typography>
        </Alert>
      </PageContainer>
    );
  }

  if (!data) {
    return (
      <PageContainer title="Dashboard" description="Panel de control principal">
        <Alert severity="info">No hay datos disponibles</Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Dashboard" description="Panel de control principal">
      <Box>
        <Grid container spacing={3}>
          {/* Cards de resumen */}
          <Grid size={12}>
            <ResumenCards resumen={data.resumen} />
          </Grid>

          {/* Consulta Natural con IA */}
          <Grid size={12}>
            <ConsultaNaturalDashboard />
          </Grid>

          {/* Ventas Semanales */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <VentasSemanales ventas={data.ventas_semana} />
          </Grid>

          {/* Ingresos por Método de Pago */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <IngresosPorMetodo ingresos={data.ingresos_metodo} />
          </Grid>

          {/* Top Productos */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <TopProductos productos={data.top_productos} />
          </Grid>

          {/* Top Clientes */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <TopClientes clientes={data.top_clientes} />
          </Grid>

          {/* Stock Crítico */}
          <Grid size={12}>
            <StockCriticoTable productos={data.stock_critico} />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
