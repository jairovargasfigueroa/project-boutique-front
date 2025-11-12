export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  genero: string;
  marca: string;
  categoria: number;
  categoria_nombre?: string; // Read-only desde serializer
  image?: string | null; // URL de la imagen (puede ser S3 o local)
  stock?: number; // Calculado desde serializer (suma de variantes)
}

export interface ProductoVariante {
  id: number;
  producto: number;
  producto_nombre?: string; // Read-only desde serializer
  talla: string | null;
  precio: string | number; // DecimalField del backend
  stock: number;
  stock_minimo: number;
  hay_stock?: boolean; // Read-only desde serializer
  stock_bajo?: boolean; // Read-only desde serializer
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
}

// Tipos para crear/actualizar (sin campos read-only)
export interface ProductoCreate {
  nombre: string;
  descripcion: string;
  genero: string;
  marca: string;
  categoria: number;
  image?: File; // File para upload de imagen
}

export interface ProductoUpdate {
  nombre?: string;
  descripcion?: string;
  genero?: string;
  marca?: string;
  categoria?: number;
  image?: File; // Solo incluir si se va a cambiar la imagen
}

export interface VarianteProductoCreate {
  producto: number;
  talla?: string | null;
  precio: number;
  stock: number;
  stock_minimo: number;
}

export interface VarianteProductoUpdate {
  talla?: string | null;
  precio?: number;
  stock?: number;
  stock_minimo?: number;
}

// Filtros para productos
export interface FiltrosProducto {
  search?: string;
  categoria?: number;
  marca?: string;
  genero?: "Hombre" | "Mujer" | "Unisex";
  talla?: string;
  precio_min?: number;
  precio_max?: number;
}
