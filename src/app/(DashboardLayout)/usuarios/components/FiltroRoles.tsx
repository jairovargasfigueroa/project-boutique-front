"use client";
import { Tabs, Tab, Box } from "@mui/material";

interface Props {
  rolActivo?: string;
  onChange: (rol: string | undefined) => void;
}

export default function FiltroRoles({ rolActivo, onChange }: Props) {
  return (
    <Box sx={{ mb: 3 }}>
      <Tabs
        value={rolActivo || "todos"}
        onChange={(_, newValue) =>
          onChange(newValue === "todos" ? undefined : newValue)
        }
      >
        <Tab label="Todos" value="todos" />
        <Tab label="Clientes" value="cliente" />
        <Tab label="Vendedores" value="vendedor" />
        <Tab label="Administradores" value="admin" />
      </Tabs>
    </Box>
  );
}
