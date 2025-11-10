"use client";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import {
  IconReceipt,
  IconCash,
  IconAlertCircle,
  IconPackageOff,
} from "@tabler/icons-react";
import type { ResumenDashboard } from "@/types/dashboard.types";

interface Props {
  resumen: ResumenDashboard;
}

const formatCurrency = (amount: number) => {
  return `Bs. ${amount.toFixed(2)}`;
};

const ResumenCards = ({ resumen }: Props) => {
  const cards = [
    {
      title: "Ventas del Mes",
      value: formatCurrency(resumen.ventas_mes.total),
      subtitle: `${resumen.ventas_mes.cantidad} ventas`,
      icon: IconReceipt,
      color: "#5D87FF",
      bgColor: "#E8F1FF",
    },
    {
      title: "Ticket Promedio",
      value: formatCurrency(resumen.ventas_mes.promedio),
      subtitle: "Por venta",
      icon: IconCash,
      color: "#49BEFF",
      bgColor: "#E8F7FF",
    },
    {
      title: "Morosidad",
      value: formatCurrency(resumen.morosidad.monto_vencido),
      subtitle: `${resumen.morosidad.cuotas_vencidas} cuotas vencidas`,
      icon: IconAlertCircle,
      color: "#FA896B",
      bgColor: "#FFF5F2",
    },
    {
      title: "Stock Crítico",
      value: resumen.productos_stock_critico.toString(),
      subtitle: "Productos con stock bajo",
      icon: IconPackageOff,
      color: "#FFAE1F",
      bgColor: "#FFF8E8",
    },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid key={card.title} size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card
            sx={{
              padding: 0,
              border: "1px solid #E5EAF2",
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    backgroundColor: card.bgColor,
                    borderRadius: "12px",
                    width: 48,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <card.icon size={24} color={card.color} />
                </Box>
                <Box flex={1}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    fontWeight={400}
                  >
                    {card.title}
                  </Typography>
                  <Typography variant="h4" fontWeight={600} mt={0.5}>
                    {card.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {card.subtitle}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ResumenCards;
