'use client';
import React from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  TableContainer,
} from "@mui/material";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { GenericTableProps } from "./types";

const GenericTable = ({ 
  title,
  subtitle,
  columns, 
  data, 
  loading = false, 
  emptyMessage = "No hay datos disponibles",
  actions,
  action
}: GenericTableProps) => {
  return (
    <DashboardCard 
      title={title} 
      subtitle={subtitle}
      action={action}
    >
      <Box sx={{ overflow: "auto" }}>
        {loading ? (
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            p={4}
            minHeight="200px"
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box mt={2} sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
            <Table
              sx={{
                whiteSpace: "nowrap",
              }}
            >
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell 
                      key={column.key} 
                      align={column.align || 'left'}
                      sx={{ width: column.width }}
                    >
                      <Typography 
                        variant="subtitle2" 
                        sx={{ fontWeight: 600 }}
                      >
                        {column.label}
                      </Typography>
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell align="center">
                      <Typography 
                        variant="subtitle2" 
                        sx={{ fontWeight: 600 }}
                      >
                        Acciones
                      </Typography>
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell 
                      colSpan={columns.length + (actions ? 1 : 0)} 
                      align="center"
                      sx={{ py: 4 }}
                    >
                      <Typography 
                        color="textSecondary"
                        variant="body1"
                      >
                        {emptyMessage}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row, index) => (
                    <TableRow key={row.id || index}>
                      {columns.map((column) => (
                        <TableCell 
                          key={column.key} 
                          align={column.align || 'left'}
                        >
                          {column.render 
                            ? column.render(row[column.key], row)
                            : (
                              <Typography
                                sx={{
                                  fontSize: "15px",
                                  fontWeight: "500",
                                }}
                              >
                                {row[column.key]}
                              </Typography>
                            )
                          }
                        </TableCell>
                      ))}
                      {actions && (
                        <TableCell align="center">
                          {actions(row)}
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Box>
        )}
      </Box>
    </DashboardCard>
  );
};

export default GenericTable;