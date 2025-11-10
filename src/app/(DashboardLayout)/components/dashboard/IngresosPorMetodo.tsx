"use client";
import dynamic from "next/dynamic";
import { useTheme } from "@mui/material/styles";
import { Grid, Stack, Typography, Box } from "@mui/material";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import type { IngresoMetodo } from "@/types/dashboard.types";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Props {
  ingresos: IngresoMetodo[];
}

const IngresosPorMetodo = ({ ingresos }: Props) => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.light;
  const error = theme.palette.error.main;

  const data = ingresos.map((i) => i.total);
  const total = data.reduce((acc, val) => acc + val, 0);

  const metodoLabels: Record<string, string> = {
    efectivo: "Efectivo",
    tarjeta: "Tarjeta",
    qr: "QR",
  };

  const metodoColors: Record<string, string> = {
    efectivo: primary,
    tarjeta: secondary,
    qr: error,
  };

  const optionsChart: any = {
    chart: {
      type: "donut",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      },
      height: 170,
    },
    colors: ingresos.map((i) => metodoColors[i.metodo]),
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: "75%",
          background: "transparent",
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: false,
      y: {
        formatter: (value: number) => `Bs. ${value.toFixed(2)}`,
      },
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    labels: ingresos.map((i) => metodoLabels[i.metodo]),
  };

  return (
    <DashboardCard title="Ingresos por Método de Pago">
      <Grid container spacing={3}>
        <Grid size={{ xs: 7, sm: 7 }}>
          <Typography variant="h3" fontWeight="700">
            Bs. {total.toFixed(2)}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary" mt={1}>
            Total de ingresos
          </Typography>

          <Stack spacing={2} mt={3}>
            {ingresos.map((ingreso) => (
              <Stack
                key={ingreso.metodo}
                direction="row"
                spacing={2}
                alignItems="center"
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: metodoColors[ingreso.metodo],
                  }}
                />
                <Box flex={1}>
                  <Typography variant="body2" fontWeight={600}>
                    {metodoLabels[ingreso.metodo]}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {ingreso.cantidad_transacciones} transacciones
                  </Typography>
                </Box>
                <Typography variant="body2" fontWeight={600}>
                  Bs. {ingreso.total.toFixed(2)}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Grid>

        <Grid size={{ xs: 5, sm: 5 }}>
          <Chart
            options={optionsChart}
            series={data}
            type="donut"
            height={180}
            width="100%"
          />
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default IngresosPorMetodo;
