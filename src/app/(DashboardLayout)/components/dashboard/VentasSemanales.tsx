"use client";
import dynamic from "next/dynamic";
import { useTheme } from "@mui/material/styles";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import type { VentaSemana } from "@/types/dashboard.types";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Props {
  ventas: VentaSemana[];
}

const VentasSemanales = ({ ventas }: Props) => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  // Extraer datos para el gráfico
  const categories = ventas.map((v) => {
    const fecha = new Date(v.fecha);
    const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    return dias[fecha.getDay()];
  });

  const data = ventas.map((v) => v.total);

  const optionsChart: any = {
    chart: {
      type: "area",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      },
      height: 350,
    },
    colors: [primary],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `Bs. ${value.toFixed(0)}`,
      },
    },
    grid: {
      borderColor: "rgba(0,0,0,0.1)",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
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
  };

  const seriesChart = [
    {
      name: "Ventas",
      data: data,
    },
  ];

  return (
    <DashboardCard title="Ventas de la Última Semana">
      <Chart
        options={optionsChart}
        series={seriesChart}
        type="area"
        height={350}
        width="100%"
      />
    </DashboardCard>
  );
};

export default VentasSemanales;
