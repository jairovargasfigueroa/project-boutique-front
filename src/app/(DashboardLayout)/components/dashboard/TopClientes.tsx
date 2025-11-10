"use client";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  Chip,
} from "@mui/material";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import type { TopCliente } from "@/types/dashboard.types";

interface Props {
  clientes: TopCliente[];
}

const TopClientes = ({ clientes }: Props) => {
  const getInitials = (nombre: string) => {
    return nombre
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getColorFromName = (nombre: string) => {
    const colors = [
      "#5D87FF",
      "#49BEFF",
      "#13DEB9",
      "#FFAE1F",
      "#FA896B",
    ];
    const index = nombre.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <DashboardCard title="Top 5 Clientes Frecuentes">
      <Box sx={{ overflow: "auto", maxHeight: 400 }}>
        <Table
          aria-label="top clientes"
          sx={{
            whiteSpace: "nowrap",
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Cliente
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="subtitle2" fontWeight={600}>
                  Compras
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2" fontWeight={600}>
                  Total Gastado
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map((cliente, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      sx={{
                        bgcolor: getColorFromName(cliente.nombre),
                        width: 36,
                        height: 36,
                        fontSize: "0.875rem",
                      }}
                    >
                      {getInitials(cliente.nombre)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {cliente.nombre}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {cliente.correo}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={cliente.cantidad_compras}
                    size="small"
                    color="success"
                    variant="outlined"
                    sx={{ minWidth: 50 }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Bs. {cliente.total_compras.toFixed(2)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </DashboardCard>
  );
};

export default TopClientes;
