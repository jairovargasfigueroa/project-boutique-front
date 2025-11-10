"use client";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Alert,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { usuarioService, UsuarioListItem } from "@/services/usuarioService";

interface DatosCliente {
  cliente: string;
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  ciudad: string;
}

interface FormularioDatosProps {
  disabled?: boolean;
  onDatosChange?: (datos: DatosCliente) => void;
  initialValues?: Partial<DatosCliente>;
}

export default function FormularioDatos({
  disabled = false,
  onDatosChange,
  initialValues,
}: FormularioDatosProps) {
  const [datos, setDatos] = useState<DatosCliente>({
    cliente: initialValues?.cliente || "",
    nombre: initialValues?.nombre || "",
    telefono: initialValues?.telefono || "",
    email: initialValues?.email || "",
    direccion: initialValues?.direccion || "",
    ciudad: initialValues?.ciudad || "",
  });

  const [clientes, setClientes] = useState<UsuarioListItem[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [selectedCliente, setSelectedCliente] =
    useState<UsuarioListItem | null>(null);

  // Cargar lista de clientes
  useEffect(() => {
    const cargarClientes = async () => {
      try {
        setLoadingClientes(true);
        const data = await usuarioService.getClientes();
        setClientes(data);
      } catch (error) {
        console.error("Error al cargar clientes:", error);
      } finally {
        setLoadingClientes(false);
      }
    };

    if (!disabled) {
      cargarClientes();
    }
  }, [disabled]);

  const handleChange =
    (field: keyof DatosCliente) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nuevosDatos = { ...datos, [field]: event.target.value };
      setDatos(nuevosDatos);
      onDatosChange?.(nuevosDatos);
    };

  const handleClienteSelect = (cliente: UsuarioListItem | null) => {
    setSelectedCliente(cliente);

    if (cliente) {
      const nuevosDatos = {
        cliente: cliente.id.toString(),
        nombre: usuarioService.formatearNombreCompleto(cliente),
        telefono: cliente.telefono || "",
        email: cliente.email,
        direccion: "", // No tenemos dirección en el usuario
        ciudad: "",
      };
      setDatos(nuevosDatos);
      onDatosChange?.(nuevosDatos);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Información de Entrega
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
          {/* Buscar cliente por username */}
          <Autocomplete
            options={clientes}
            getOptionLabel={(option) =>
              `${option.username} - ${usuarioService.formatearNombreCompleto(
                option
              )}`
            }
            loading={loadingClientes}
            value={selectedCliente}
            onChange={(_, newValue) => handleClienteSelect(newValue)}
            disabled={disabled}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Buscar Cliente"
                placeholder="Busca por username o nombre..."
                helperText="Busca un cliente existente para autocompletar sus datos"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingClientes ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

          <TextField
            label="ID Cliente"
            fullWidth
            disabled
            value={datos.cliente}
            placeholder="Se llenará automáticamente"
            helperText="ID del cliente seleccionado"
            type="number"
          />

          <TextField
            label="Nombre completo"
            fullWidth
            disabled
            value={datos.nombre}
            placeholder="Se llenará automáticamente"
          />

          <TextField
            label="Teléfono"
            fullWidth
            value={datos.telefono}
            onChange={handleChange("telefono")}
            placeholder="Ej: 70123456"
            helperText="Editable: puedes modificar el teléfono"
          />

          <TextField
            label="Email"
            type="email"
            fullWidth
            disabled
            value={datos.email}
            placeholder="Se llenará automáticamente"
          />

          <TextField
            label="Dirección"
            fullWidth
            multiline
            rows={2}
            value={datos.direccion}
            onChange={handleChange("direccion")}
            placeholder="Ej: Zona Sur, Calle 21, Casa 456"
            helperText="Ingresa la dirección de entrega"
          />

          <TextField
            label="Ciudad"
            fullWidth
            value={datos.ciudad}
            onChange={handleChange("ciudad")}
            placeholder="Ej: La Paz, Cochabamba, Santa Cruz"
            helperText="Ciudad de entrega"
          />
        </Box>
      </CardContent>
    </Card>
  );
}
