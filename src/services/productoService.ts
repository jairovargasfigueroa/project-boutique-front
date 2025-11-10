import {
  Producto,
  ProductoVariante,
  ProductoCreate,
  ProductoUpdate,
} from "@/types/productos";
import { apiClient } from "./apiBase";

const ENDPOINT = "/productos/";

const prepareProductoData = (
  data: ProductoCreate
): FormData | Omit<ProductoCreate, "image"> => {
  if (!data.image) {
    const { image, ...jsonData } = data;
    return jsonData;
  }

  const formData = new FormData();
  formData.append("nombre", data.nombre);
  formData.append("descripcion", data.descripcion);
  formData.append("genero", data.genero);
  formData.append("marca", data.marca);
  formData.append("categoria", data.categoria.toString());
  formData.append("image", data.image);

  return formData;
};

const prepareProductoUpdateData = (
  data: ProductoUpdate
): FormData | ProductoUpdate => {
  if (!data.image) {
    const { image, ...jsonData } = data;
    return jsonData;
  }

  const formData = new FormData();
  if (data.nombre !== undefined) formData.append("nombre", data.nombre);
  if (data.descripcion !== undefined)
    formData.append("descripcion", data.descripcion);
  if (data.genero !== undefined) formData.append("genero", data.genero);
  if (data.marca !== undefined) formData.append("marca", data.marca);
  if (data.categoria !== undefined)
    formData.append("categoria", data.categoria.toString());
  formData.append("image", data.image);

  return formData;
};

export const productoService = {
  getAll: async () => {
    const response = await apiClient.get<Producto[]>(ENDPOINT);
    return response.data;
  },

  getByCategory: async (categoriaId: number) => {
    const response = await apiClient.get<Producto[]>(ENDPOINT, {
      params: { categoria: categoriaId },
    });
    return response.data;
  },

  getByGenero: async (genero: string) => {
    const response = await apiClient.get<Producto[]>(ENDPOINT, {
      params: { genero },
    });
    return response.data;
  },

  getByMarca: async (marca: string) => {
    const response = await apiClient.get<Producto[]>(ENDPOINT, {
      params: { marca },
    });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<Producto>(`${ENDPOINT}${id}/`);
    return response.data;
  },

  search: async (query: string) => {
    const response = await apiClient.get<Producto[]>(ENDPOINT, {
      params: { search: query },
    });
    return response.data;
  },

  create: async (data: ProductoCreate) => {
    const payload = prepareProductoData(data);
    const response = await apiClient.post<Producto>(ENDPOINT, payload, {
      headers:
        payload instanceof FormData
          ? {
              "Content-Type": "multipart/form-data",
            }
          : undefined,
    });
    return response.data;
  },

  update: async (id: number, data: ProductoUpdate) => {
    console.log("🔄 Actualizando producto:", id, data);
    const payload = prepareProductoUpdateData(data);
    console.log(
      "📦 Payload preparado:",
      payload instanceof FormData ? "FormData" : payload
    );

    const response = await apiClient.put<Producto>(
      `${ENDPOINT}${id}/`,
      payload,
      {
        headers:
          payload instanceof FormData
            ? {
                "Content-Type": "multipart/form-data",
              }
            : undefined,
      }
    );
    console.log("✅ Producto actualizado:", response.data);
    return response.data;
  },

  /**
   * Actualización parcial - Solo para campos sin imagen
   */
  patch: async (id: number, data: Partial<ProductoUpdate>) => {
    const { image, ...patchData } = data;
    const response = await apiClient.patch<Producto>(
      `${ENDPOINT}${id}/`,
      patchData
    );
    return response.data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`${ENDPOINT}${id}/`);
  },
  getVariantesByProducto: async (productoId: number) => {
    const response = await apiClient.get<ProductoVariante[]>(
      `${ENDPOINT}${productoId}/variantes/`
    );
    return response.data;
  },
};
