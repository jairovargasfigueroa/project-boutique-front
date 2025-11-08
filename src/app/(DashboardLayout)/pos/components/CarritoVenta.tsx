"use client";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
  Avatar,
  Paper,
} from "@mui/material";
import { Delete, Add, Remove } from "@mui/icons-material";
import GenericTable from "@/components/common/GenericTable";
import { useCarritoVentaStore } from "@/store/carritoVentaStore";

interface Props {
  onCobrar: () => void;
}

const CarritoVenta = ({ onCobrar }: Props) => {
  const {
    items,
    removeItem,
    incrementarCantidad,
    decrementarCantidad,
    getTotal,
    clearCarrito,
  } = useCarritoVentaStore();

  // Configuración de columnas
  const columns = [
    {
      key: "imagen_url",
      label: "Imagen",
      align: "center" as const,
      width: "80px",
      render: (value: string) => (
        <Avatar src={value} alt="Producto" sx={{ width: 40, height: 40 }} />
      ),
    },
    {
      key: "producto_nombre",
      label: "Descripción",
      render: (_: any, row: any) => (
        <Box>
          <Typography variant="body2" fontWeight={500}>
            {row.producto_nombre}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {row.talla} - {row.color}
          </Typography>
        </Box>
      ),
    },
    {
      key: "cantidad",
      label: "Cantidad",
      align: "center" as const,
      render: (value: number, row: any) => (
        <Box display="flex" alignItems="center" gap={1} justifyContent="center">
          <IconButton
            size="small"
            onClick={() => decrementarCantidad(row.variante_id)}
            disabled={value <= 1}
          >
            <Remove fontSize="small" />
          </IconButton>
          <Chip label={value} size="small" />
          <IconButton
            size="small"
            onClick={() => incrementarCantidad(row.variante_id)}
            disabled={value >= row.stock_disponible}
          >
            <Add fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => removeItem(row.variante_id)}
            title="Eliminar"
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
    {
      key: "precio_unitario",
      label: "Precio Unit.",
      align: "right" as const,
      render: (value: number) => `Bs ${value.toFixed(2)}`,
    },
    {
      key: "subtotal",
      label: "Subtotal",
      align: "right" as const,
      render: (value: number) => (
        <Typography variant="body2" fontWeight={600}>
          Bs {value.toFixed(2)}
        </Typography>
      ),
    },
  ];

  return (
    <Paper
      elevation={3}
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Box p={2} borderBottom="1px solid #e0e0e0">
        <Typography variant="h6">🧾 Detalle de venta</Typography>
      </Box>

      <Box flex={1} overflow="auto">
        {items.length === 0 ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
            p={3}
          >
            <Typography color="textSecondary" align="center">
              No hay productos en el carrito
              <br />
              Busca y agrega productos para iniciar una venta
            </Typography>
          </Box>
        ) : (
          <GenericTable
            title=""
            columns={columns}
            data={items}
            loading={false}
            emptyMessage="No hay productos"
            actions={undefined}
          />
        )}
      </Box>

      <Box p={2} borderTop="1px solid #e0e0e0">
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h6">TOTAL:</Typography>
          <Typography variant="h6" color="primary">
            Bs {getTotal().toFixed(2)}
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={clearCarrito}
            disabled={items.length === 0}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={onCobrar}
            disabled={items.length === 0}
          >
            Cobrar
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default CarritoVenta;
