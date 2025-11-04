"use client";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import type { ReportResponse } from "@/types/reportes.types";

interface Props {
  reporte: ReportResponse | null;
  loading?: boolean;
}

const ReporteTabla = ({ reporte, loading }: Props) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!reporte) {
    return (
      <Card>
        <CardContent>
          <Typography color="text.secondary" textAlign="center">
            No hay datos para mostrar
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        {reporte.summary && (
          <Typography variant="h6" mb={2}>
            {reporte.summary}
          </Typography>
        )}

        <Box sx={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e0e0e0" }}>
                {reporte.columns.map((col) => (
                  <th
                    key={col}
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      fontWeight: 600,
                      color: "#666",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reporte.rows.map((row, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: "1px solid #f0f0f0",
                    background: idx % 2 === 0 ? "#fafafa" : "white",
                  }}
                >
                  {reporte.columns.map((col) => (
                    <td
                      key={col}
                      style={{
                        padding: "12px",
                      }}
                    >
                      {row[col] ?? "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Box>

        {reporte.meta && (
          <Box mt={3} p={2} bgcolor="grey.100" borderRadius={1}>
            <Typography variant="subtitle2" fontWeight={600} mb={1}>
              📊 Resumen
            </Typography>
            {Object.entries(reporte.meta).map(([key, value]) => (
              <Typography key={key} variant="body2">
                <strong>{key}:</strong> {JSON.stringify(value)}
              </Typography>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ReporteTabla;
