// app/(DashboardLayout)/producto/[id]/components/SelectorTalla.tsx

import { Box, Button, Typography } from '@mui/material'

interface Props {
  tallas: string[]
  tallaSeleccionada: string
  onChange: (talla: string) => void
}

export default function SelectorTalla({ tallas, tallaSeleccionada, onChange }: Props) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
        Talla
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {tallas.map(talla => (
          <Button
            key={talla}
            variant={tallaSeleccionada === talla ? 'contained' : 'outlined'}
            onClick={() => onChange(talla)}
            sx={{ minWidth: 60 }}
          >
            {talla}
          </Button>
        ))}
      </Box>
    </Box>
  )
}