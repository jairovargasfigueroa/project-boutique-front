export interface Producto {
  id: number;
  nombre: string;
  categoria: number;
  categoria_nombre: string;
  precio_base: number;
  genero: string;
  descripcion: string;
  imagen_url?: string;
  stock: number;
}

export interface ProductoVariante {
  id: number;
  talla: string;
  color: string;
  precio_venta: number;
  precio_costo?: number;
  stock: number;
  stock_minimo?: number;
  producto: number;
}
export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
}
