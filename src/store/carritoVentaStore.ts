import { create } from "zustand";
import type { ItemCarritoVenta } from "@/types/venta.types";

interface CarritoVentaState {
  items: ItemCarritoVenta[];
  addItem: (item: Omit<ItemCarritoVenta, "subtotal">) => void;
  removeItem: (varianteId: number) => void;
  updateCantidad: (varianteId: number, cantidad: number) => void;
  incrementarCantidad: (varianteId: number) => void;
  decrementarCantidad: (varianteId: number) => void;
  clearCarrito: () => void;
  getTotal: () => number;
  getCantidadTotal: () => number;
}

export const useCarritoVentaStore = create<CarritoVentaState>((set, get) => ({
  items: [],

  addItem: (item) => {
    const items = get().items;
    const existingItem = items.find((i) => i.variante_id === item.variante_id);

    if (existingItem) {
      set({
        items: items.map((i) =>
          i.variante_id === item.variante_id
            ? {
                ...i,
                cantidad: i.cantidad + item.cantidad,
                subtotal: (i.cantidad + item.cantidad) * i.precio_unitario,
              }
            : i
        ),
      });
    } else {
      set({
        items: [
          ...items,
          {
            ...item,
            subtotal: item.cantidad * item.precio_unitario,
          },
        ],
      });
    }
  },

  removeItem: (varianteId) => {
    set({
      items: get().items.filter((item) => item.variante_id !== varianteId),
    });
  },

  updateCantidad: (varianteId, cantidad) => {
    if (cantidad <= 0) {
      get().removeItem(varianteId);
      return;
    }

    set({
      items: get().items.map((item) =>
        item.variante_id === varianteId
          ? {
              ...item,
              cantidad: Math.min(cantidad, item.stock_disponible),
              subtotal:
                Math.min(cantidad, item.stock_disponible) *
                item.precio_unitario,
            }
          : item
      ),
    });
  },

  incrementarCantidad: (varianteId) => {
    const item = get().items.find((i) => i.variante_id === varianteId);
    if (item && item.cantidad < item.stock_disponible) {
      get().updateCantidad(varianteId, item.cantidad + 1);
    }
  },

  decrementarCantidad: (varianteId) => {
    const item = get().items.find((i) => i.variante_id === varianteId);
    if (item) {
      get().updateCantidad(varianteId, item.cantidad - 1);
    }
  },

  clearCarrito: () => {
    set({ items: [] });
  },

  getTotal: () => {
    return get().items.reduce((total, item) => total + item.subtotal, 0);
  },

  getCantidadTotal: () => {
    return get().items.reduce((total, item) => total + item.cantidad, 0);
  },
}));
