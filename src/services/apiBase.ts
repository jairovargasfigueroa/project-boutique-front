import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

// URL base de la API - configurable por environment
//const API_BASE_URL =
//  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.albadev.me/api";

// Instancia principal de axios
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos
  headers: {
    "Content-Type": "application/json",
  },
});

// ========================================
// INTERCEPTOR: Agregar token automáticamente a cada request
// ========================================
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Leer token de localStorage
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // Si existe token, agregarlo al header Authorization
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ========================================
// INTERCEPTOR: Manejar errores de autenticación (401)
// ========================================
apiClient.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, retornarla tal cual
    return response;
  },
  (error: AxiosError) => {
    // Si el error es 401 (No autorizado / token inválido o expirado)
    if (error.response?.status === 401) {
      // Limpiar localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("auth-storage");

        // Redirigir a login solo si no estamos ya en una ruta de autenticación
        const currentPath = window.location.pathname;
        if (
          !currentPath.includes("/authentication/login") &&
          !currentPath.includes("/authentication/register")
        ) {
          window.location.href = "/authentication/login";
        }
      }
    }

    return Promise.reject(error);
  }
);
