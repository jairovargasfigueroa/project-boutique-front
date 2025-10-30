// // src/services/apiBase.ts
// const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
// const IS_SERVER = typeof window === 'undefined';

// export interface ApiError {
//   message: string;
//   statusCode: number;
// }

// export interface ApiResponse<T> {
//   data: T;
//   message?: string;
// }

// export class ApiBase {
//   private static getHeaders(): HeadersInit {
//     const headers: HeadersInit = {
//       'Content-Type': 'application/json',
//       'Accept': 'application/json',
//     };

//     if (!IS_SERVER) {
//       const token = localStorage.getItem('token');
//       if (token) {
//         headers['Authorization'] = `Bearer ${token}`;
//       }
//     }

//     return headers;
//   }

//   private static async handleResponse<T>(response: Response): Promise<T> {
//     if (!response.ok) {
//       const error: ApiError = await response.json().catch(() => ({
//         message: 'Error de servidor',
//         statusCode: response.status
//       }));

//       throw new Error(error.message || `Error ${response.status}`);
//     }

//     const data = await response.json();
//     return data.data;
//   }

//   static async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
//     const url = params
//       ? `${API_BASE}${endpoint}?${new URLSearchParams(params)}`
//       : `${API_BASE}${endpoint}`;

//     const response = await fetch(url, {
//        headers: this.getHeaders(),
//     //   cache: 'no-store' // Para Next.js
//     });

//     return this.handleResponse<T>(response);
//   }

//   static async post<T>(endpoint: string, data: any): Promise<T> {
//     const response = await fetch(`${API_BASE}${endpoint}`, {
//       method: 'POST',
//       headers: this.getHeaders(),
//       body: JSON.stringify(data),
//       cache: 'no-store'
//     });

//     return this.handleResponse<T>(response);
//   }

//   static async put<T>(endpoint: string, data: any): Promise<T> {
//     const response = await fetch(`${API_BASE}${endpoint}`, {
//       method: 'PUT',
//       headers: this.getHeaders(),
//       body: JSON.stringify(data),
//       cache: 'no-store'
//     });

//     return this.handleResponse<T>(response);
//   }

//   static async delete<T>(endpoint: string): Promise<T> {
//     const response = await fetch(`${API_BASE}${endpoint}`, {
//       method: 'DELETE',
//       headers: this.getHeaders(),
//       cache: 'no-store'
//     });

//     return this.handleResponse<T>(response);
//   }
// }

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// URL base de la API - configurable por environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Instancia principal de axios
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});