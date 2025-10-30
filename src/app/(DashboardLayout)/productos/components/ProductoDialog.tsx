'use client';
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box
} from '@mui/material';
import { Producto } from '@/types/productos';

interface Props {
  open: boolean;
  mode: 'create' | 'edit';
  initialData: Partial<Producto>;
  onClose: () => void;
  onSubmit: (data: Partial<Producto>) => Promise<void>;
}

const ProductoDialog: React.FC<Props> = ({ open, mode, initialData, onClose, onSubmit }) => {
  const [form, setForm] = useState<Partial<Producto>>(initialData);

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  const handleChange = (field: keyof Producto, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    await onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{mode === 'create' ? 'Crear nuevo producto' : 'Editar producto'}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Nombre"
            fullWidth
            value={form.nombre || ''}
            onChange={e => handleChange('nombre', e.target.value)}
          />

          <TextField
            label="Descripcion"
            fullWidth
            value={form.descripcion || ''}
            onChange={e => handleChange('descripcion', e.target.value)}
          />
          <TextField
            label="Categoría"
            fullWidth
            value={form.categoria || ''}
            onChange={e => handleChange('categoria', e.target.value)}
          />
          <TextField
            label="Precio"
            type="number"
            fullWidth
            value={form.precio ?? ''}
            onChange={e => handleChange('precio', parseFloat(e.target.value))}
          />
          <TextField
            label="Stock"
            type="number"
            fullWidth
            value={form.stock ?? ''}
            onChange={e => handleChange('stock', parseInt(e.target.value, 10))}
          />
          <TextField
            label="URL de Imagen"
            fullWidth
            value={form.imagen || ''}
            onChange={e => handleChange('imagen', e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSave}>
          {mode === 'create' ? 'Crear' : 'Actualizar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductoDialog;
