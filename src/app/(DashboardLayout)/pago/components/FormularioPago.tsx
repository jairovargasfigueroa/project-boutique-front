'use client';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel
} from '@mui/material';
import { useState } from 'react';

interface DatosPago {
  monto_pagado: string;
  metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia' | 'qr';
  referencia_pago: string;
}

interface FormularioPagoProps {
  totalVenta: number;
  onDatosChange?: (datos: DatosPago) => void;
  initialValues?: Partial<DatosPago>;
}

export default function FormularioPago({ 
  totalVenta,
  onDatosChange,
  initialValues 
}: FormularioPagoProps) {
  const [datos, setDatos] = useState<DatosPago>({
    monto_pagado: initialValues?.monto_pagado || totalVenta.toString(),
    metodo_pago: initialValues?.metodo_pago || 'efectivo',
    referencia_pago: initialValues?.referencia_pago || ''
  });

  const handleChange = (field: keyof DatosPago) => (
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
          Información de Pago
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
          {/* Total a pagar */}
          <Box 
            sx={{ 
              p: 2, 
              bgcolor: 'primary.light', 
              borderRadius: 1,
              textAlign: 'center'
            }}
          >
            <Typography variant="body2" color="primary.contrastText">
              Total de la venta
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="primary.contrastText">
              ${totalVenta.toLocaleString()}
            </Typography>
          </Box>
          
          {/* Método de pago */}
          <FormControl component="fieldset">
            <FormLabel component="legend">Método de Pago</FormLabel>
            <RadioGroup
              value={datos.metodo_pago}
              onChange={handleChange('metodo_pago')}
            >
              <FormControlLabel 
                value="efectivo" 
                control={<Radio />} 
                label="💵 Efectivo" 
              />
              <FormControlLabel 
                value="tarjeta" 
                control={<Radio />} 
                label="💳 Tarjeta" 
              />
              <FormControlLabel 
                value="transferencia" 
                control={<Radio />} 
                label="🏦 Transferencia" 
              />
              <FormControlLabel 
                value="qr" 
                control={<Radio />} 
                label="📱 Código QR" 
              />
            </RadioGroup>
          </FormControl>
          
          {/* Monto pagado */}
          <TextField
            label="Monto Pagado"
            fullWidth
            type="number"
            value={datos.monto_pagado}
            onChange={handleChange('monto_pagado')}
            helperText={`Total a pagar: $${totalVenta.toLocaleString()}`}
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
            }}
          />
          
          {/* Referencia */}
          <TextField
            label="Referencia de Pago"
            fullWidth
            multiline
            rows={2}
            value={datos.referencia_pago}
            onChange={handleChange('referencia_pago')}
            placeholder="Ej: Pago inicial, Transferencia #123456, etc."
            helperText="Información adicional sobre el pago"
          />
        </Box>
      </CardContent>
    </Card>
  );
}
