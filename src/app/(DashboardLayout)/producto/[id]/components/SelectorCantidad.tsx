// app/(DashboardLayout)/producto/[id]/components/SelectorCantidad.tsx

import { Box, IconButton, Typography } from '@mui/material'
import { Add, Remove } from '@mui/icons-material'

interface Props {
  cantidad: number
  onChange: (cantidad: number) => void
  max?: number
}

export default function SelectorCantidad({ cantidad, onChange, max = 99 }: Props) {
  const handleDecrementar = () => {
    if (cantidad > 1) {
      onChange(cantidad - 1)
    }
  }
  
  const handleIncrementar = () => {
    if (cantidad < max) {
      onChange(cantidad + 1)
    }
  }
  
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
        Cantidad
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton 
          onClick={handleDecrementar}
          disabled={cantidad <= 1}
          sx={{ border: '1px solid #ddd' }}
        >
          <Remove />
        </IconButton>
        
        <Typography variant="h6" sx={{ minWidth: 40, textAlign: 'center' }}>
          {cantidad}
        </Typography>
        
        <IconButton 
          onClick={handleIncrementar}
          disabled={cantidad >= max}
          sx={{ border: '1px solid #ddd' }}
        >
          <Add />
        </IconButton>
      </Box>
    </Box>
  )
}