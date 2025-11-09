"use client";
import { Box, Chip, IconButton, Tooltip } from "@mui/material";
import { IconEye } from "@tabler/icons-react";
import GenericTable from "@/components/common/GenericTable";
import type { Venta } from "@/types/ventas";
import type { TableColumn } from "@/components/common/GenericTable/types";
import { useVentas } from "@/hooks/useVentas";

interface Props {
  onVerDetalle: (venta: Venta) => void;
}

const VentasTable = ({ onVerDetalle }: Props) => {
  const { ventas, loading } = useVentas();

  const getEstadoPagoColor = (estado: string) => {
    switch (estado) {
      case "pagado":
        return "success";
      case "parcial":
        return "warning";
      case "pendiente":
        return "error";
      default:
        return "default";
    }
  };

  const getTipoPagoColor = (tipo: string) => {
    return tipo === "contado" ? "primary" : "secondary";
  };

  const columns: TableColumn[] = [
    {
      key: "id",
      label: "# Venta",
      width: "80px",
      render: (_value: any, venta: Venta) => `#${venta.id}`,
    },
    {
      key: "fecha",
      label: "Fecha",
      width: "130px",
      render: (_value: any, venta: Venta) =>
        new Date(venta.fecha).toLocaleDateString("es-BO"),
    },
    {
      key: "cliente",
      label: "Cliente",
      width: "200px",
      render: (_value: any, venta: Venta) =>
        venta.cliente_nombre || "Cliente Anónimo",
    },
    {
      key: "tipo_venta",
      label: "Tipo",
      width: "120px",
      render: (_value: any, venta: Venta) => (
        <Chip
          label={venta.tipo_venta === "contado" ? "Contado" : "Crédito"}
          color={getTipoPagoColor(venta.tipo_venta) as any}
          size="small"
        />
      ),
    },
    {
      key: "total",
      label: "Total",
      width: "120px",
      render: (_value: any, venta: Venta) => {
        const total =
          venta.tipo_venta === "credito" && venta.total_con_interes
            ? parseFloat(venta.total_con_interes)
            : parseFloat(venta.total);
        return `Bs ${total.toFixed(2)}`;
      },
    },
    {
      key: "estado",
      label: "Estado",
      width: "120px",
      render: (_value: any, venta: Venta) => (
        <Chip
          label={venta.estado.charAt(0).toUpperCase() + venta.estado.slice(1)}
          color={getEstadoPagoColor(venta.estado) as any}
          size="small"
        />
      ),
    },
    {
      key: "cuotas",
      label: "Info Crédito",
      width: "180px",
      render: (_value: any, venta: Venta) =>
        venta.tipo_venta === "credito" ? (
          <Box>
            <Box fontSize="0.875rem">
              {venta.plazo_meses} cuotas × Bs{" "}
              {parseFloat(venta.cuota_mensual || "0").toFixed(2)}
            </Box>
            <Box fontSize="0.75rem" color="text.secondary">
              Interés: {venta.interes}%
            </Box>
          </Box>
        ) : (
          <Box fontSize="0.875rem" color="text.secondary">
            Pago único
          </Box>
        ),
    },
  ];

  return (
    <GenericTable
      title="Ventas Registradas"
      subtitle="Historial de todas las ventas realizadas"
      columns={columns}
      data={ventas}
      loading={loading}
      emptyMessage="No hay ventas registradas"
      actions={(row: Venta) => (
        <Tooltip title="Ver Detalle">
          <IconButton
            color="primary"
            size="small"
            onClick={() => onVerDetalle(row)}
          >
            <IconEye size={20} />
          </IconButton>
        </Tooltip>
      )}
    />
  );
};

export default VentasTable;
