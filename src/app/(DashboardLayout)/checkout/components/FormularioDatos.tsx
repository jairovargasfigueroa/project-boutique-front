'use client';
import { Box, Card, CardContent, Typography, TextField, Alert } from '@mui/material';
import { useState } from 'react';

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
  disabled = true,
  onDatosChange,
  initialValues 
}: FormularioDatosProps) {
  const [datos, setDatos] = useState<DatosCliente>({
    cliente: initialValues?.cliente || '',
    nombre: initialValues?.nombre || '',
    telefono: initialValues?.telefono || '',
    email: initialValues?.email || '',
    direccion: initialValues?.direccion || '',
    ciudad: initialValues?.ciudad || ''
  });

  const handleChange = (field: keyof DatosCliente) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const nuevosDatos = { ...datos, [field]: event.target.value };
    setDatos(nuevosDatos);
    onDatosChange?.(nuevosDatos);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Información de Entrega
        </Typography>
        
        {disabled && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Próximamente podrás ingresar tus datos de envío aquí.
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: disabled ? 2 : 3 }}>
          <TextField
            label="ID Cliente"
            fullWidth
            disabled={disabled}
            value={datos.cliente}
            onChange={handleChange('cliente')}
            placeholder={disabled ? "Próximamente..." : "1"}
            helperText={disabled ? "" : "ID del cliente (número)"}
            type="number"
          />
          
          <TextField
            label="Nombre completo"
            fullWidth
            disabled={disabled}
            value={datos.nombre}
            onChange={handleChange('nombre')}
            placeholder={disabled ? "Próximamente..." : "Juan Pérez"}
          />
          
          <TextField
            label="Teléfono"
            fullWidth
            disabled={disabled}
            value={datos.telefono}
            onChange={handleChange('telefono')}
            placeholder={disabled ? "Próximamente..." : "300 123 4567"}
          />
          
          <TextField
            label="Email"
            type="email"
            fullWidth
            disabled={disabled}
            value={datos.email}
            onChange={handleChange('email')}
            placeholder={disabled ? "Próximamente..." : "correo@ejemplo.com"}
          />
          
          <TextField
            label="Dirección"
            fullWidth
            disabled={disabled}
            multiline
            rows={2}
            value={datos.direccion}
            onChange={handleChange('direccion')}
            placeholder={disabled ? "Próximamente..." : "Calle 123 #45-67"}
          />
          
          <TextField
            label="Ciudad"
            fullWidth
            disabled={disabled}
            value={datos.ciudad}
            onChange={handleChange('ciudad')}
            placeholder={disabled ? "Próximamente..." : "Bogotá"}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
