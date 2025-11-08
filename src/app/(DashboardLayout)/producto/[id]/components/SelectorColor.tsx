// app/(DashboardLayout)/producto/[id]/components/SelectorColor.tsx

import { Box, Typography } from '@mui/material'

interface Props {
  colores: string[]
  colorSeleccionado: string
  onChange: (color: string) => void
}

const colorMap: Record<string, string> = {
  'Rojo': '#ff0000',
  'Azul': '#0000ff',
  'Negro': '#000000',
  'Blanco': '#ffffff',
  'Verde': '#00ff00',
  'Amarillo': '#ffff00',
}

export default function SelectorColor({ colores, colorSeleccionado, onChange }: Props) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
        Color
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {colores.map(color => (
          <Box
            key={color}
            onClick={() => onChange(color)}
            sx={{
              width: 50,
              height: 50,
              backgroundColor: colorMap[color] || '#cccccc',
              border: colorSeleccionado === color 
                ? '3px solid #000' 
                : '2px solid #ddd',
              borderRadius: '50%',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'scale(1.1)',
              }
            }}
            title={color}
          />
        ))}
      </Box>
    </Box>
  )
}