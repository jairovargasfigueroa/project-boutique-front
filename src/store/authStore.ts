// src/store/authStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '@/services/authService';
import { AuthState, RegisterRequest } from '@/types/auth';

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isLoading: false,
      isAuthenticated: false,

      /**
       * Iniciar sesión
       */
      login: async (username: string, password: string) => {
        set({ isLoading: true });
        
        try {
          const response = await authService.login({ username, password });
          
          // Guardar access token en localStorage (el que se usa en las peticiones)
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', response.access);
          }
          
          set({
            token: response.access, // Usar access token
            user: response.user,
            isAuthenticated: true,
            isLoading: false
          });
          
          console.log('✅ Login exitoso:', response.user.username);
        } catch (error: any) {
          set({ isLoading: false });
          console.error('❌ Error en login:', error.response?.data?.message || error.message);
          throw error;
        }
      },

      /**
       * Registrar nuevo usuario
       */
      register: async (data: RegisterRequest) => {
        set({ isLoading: true });
        
        try {
          const response = await authService.register(data);
          
          // Guardar access token
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', response.access);
          }
          
          set({
            token: response.access, // Usar access token
            user: response.user,
            isAuthenticated: true,
            isLoading: false
          });
          
          console.log('✅ Registro exitoso:', response.user.username);
        } catch (error: any) {
          set({ isLoading: false });
          console.error('❌ Error en registro:', error.response?.data?.message || error.message);
          throw error;
        }
      },

      /**
       * Cerrar sesión
       */
      logout: () => {
        const currentUser = get().user;
        
        // Llamar al backend (opcional)
        authService.logout().catch(() => {
          // Ignorar errores
        });
        
        // Limpiar estado
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
        
        // Limpiar localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('auth-storage');
          
          // Redirigir a login
          window.location.href = '/authentication/login';
        }
        
        console.log('👋 Logout exitoso:', currentUser?.username);
      },

      /**
       * Verificar si el token es válido
       */
      verifyToken: async () => {
        const { token } = get();
        
        if (!token) {
          set({ isAuthenticated: false });
          return false;
        }
        
        try {
          const result = await authService.verifyToken();
          
          if (result.valid && result.user) {
            set({
              user: result.user,
              isAuthenticated: true
            });
            return true;
          } else {
            // Token inválido, limpiar
            set({
              token: null,
              user: null,
              isAuthenticated: false
            });
            return false;
          }
        } catch (error) {
          // Error al verificar, limpiar
          set({
            token: null,
            user: null,
            isAuthenticated: false
          });
          return false;
        }
      }
    }),
    {
      name: 'auth-storage', // key en localStorage (diferente a 'cart-storage')
      storage: createJSONStorage(() => localStorage),
      // Solo persistir token y user, no isLoading
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useAuthStore;
