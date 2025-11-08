// app/(DashboardLayout)/carrito/components/ResumenCarrito.tsx

import { Box, Typography, Button, Divider } from '@mui/material'

interface Props {
  subtotal: number
  onProcederCheckout: () => void
}

export default function ResumenCarrito({ subtotal, onProcederCheckout }: Props) {
  const envio = subtotal > 100 ? 0 : 10
  const total = subtotal + envio
  
  return (
    <Box
      sx={{
        p: 3,
        border: '1px solid #ddd',
        borderRadius: 2,
        backgroundColor: '#f9f9f9',
        position: 'sticky',
        top: 20
      }}
    >
      <Typography variant="h6" gutterBottom>
        Resumen del Pedido
      </Typography>
      
      <Box sx={{ my: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body1">Subtotal:</Typography>
          <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body1">Envío:</Typography>
          <Typography variant="body1" color={envio === 0 ? 'success.main' : 'text.primary'}>
            {envio === 0 ? 'Gratis' : `$${envio.toFixed(2)}`}
          </Typography>
        </Box>
        
        {subtotal < 100 && (
          <Typography variant="caption" color="text.secondary">
            Envío gratis en compras mayores a $100
          </Typography>
        )}
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Total:</Typography>
        <Typography variant="h6" color="primary">
          ${total.toFixed(2)}
        </Typography>
      </Box>
      
      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={onProcederCheckout}
      >
        Proceder al Checkout
      </Button>
    </Box>
  )
}