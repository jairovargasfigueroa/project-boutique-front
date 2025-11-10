"use client";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import { IconAlertCircle } from "@tabler/icons-react";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import type { StockCritico } from "@/types/dashboard.types";

interface Props {
  productos: StockCritico[];
}

const StockCriticoTable = ({ productos }: Props) => {
  return (
    <DashboardCard title="⚠️ Productos con Stock Crítico">
      <Box sx={{ overflow: "auto", maxHeight: 400 }}>
        {productos.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">
              ✅ No hay productos con stock crítico
            </Typography>
          </Box>
        ) : (
          <Table
            aria-label="stock crítico"
            sx={{
              whiteSpace: "nowrap",
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Producto
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Talla
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Stock Actual
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Stock Mínimo
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Estado
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productos.map((producto, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={500}>
                      {producto.producto}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={producto.talla}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color={
                        producto.stock_actual === 0 ? "error.main" : "warning.main"
                      }
                    >
                      {producto.stock_actual}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" color="text.secondary">
                      {producto.stock_minimo}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      icon={<IconAlertCircle size={16} />}
                      label={producto.estado}
                      size="small"
                      color={producto.estado === "AGOTADO" ? "error" : "warning"}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>
    </DashboardCard>
  );
};

export default StockCriticoTable;
