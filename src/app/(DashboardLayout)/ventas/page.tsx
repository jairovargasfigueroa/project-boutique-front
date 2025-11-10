"use client";
import { useState } from "react";
import { Box } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import VentasTable from "./components/VentasTable";
import DetalleVentaDialog from "./components/DetalleVentaDialog";
import CuotasSection from "./components/CuotasSection";
import type { Venta } from "@/types/ventas";

const VentasPage = () => {
  const [ventaSeleccionada, setVentaSeleccionada] = useState<Venta | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleVerDetalle = (venta: Venta) => {
    setVentaSeleccionada(venta);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setTimeout(() => {
      setVentaSeleccionada(null);
    }, 300);
  };

  const handleRefresh = () => {
    // Forzar re-render de la tabla
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <PageContainer title="Ventas" description="Gestión de ventas y cuotas">
      <Box>
        {/* Alertas de Cuotas */}
        <CuotasSection key={`cuotas-${refreshKey}`} />

        {/* Tabla de Ventas */}
        <DashboardCard title="">
          <VentasTable key={refreshKey} onVerDetalle={handleVerDetalle} />
        </DashboardCard>

        {/* Dialog de Detalle */}
        <DetalleVentaDialog
          open={dialogOpen}
          venta={ventaSeleccionada}
          onClose={handleCloseDialog}
          onRefresh={handleRefresh}
        />
      </Box>
    </PageContainer>
  );
};

export default VentasPage;
