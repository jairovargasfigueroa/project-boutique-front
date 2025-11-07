'use client'

import React, { useState } from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Checkbox,
  Alert,
  CircularProgress
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import useAuthStore from "@/store/authStore";

interface loginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validaciones básicas
    if (!username || !password) {
      setError('Por favor completa todos los campos');
      return;
    }
    
    try {
      await login(username, password);
      // Si llega aquí, login fue exitoso
      router.push('/');
    } catch (err: any) {
      console.error('Error en login:', err);
      setError(err.response?.data?.detail || err.response?.data?.message || 'Usuario o contraseña incorrectos');
    }
  };
  
  return (
    <>
      {title ? (
        <Typography
          variant="h2"
          sx={{
            fontWeight: "700",
            mb: 1
          }}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      <form onSubmit={handleSubmit}>
        <Stack>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box>
            <Typography
              variant="subtitle1"
              component="label"
              htmlFor="username"
              sx={{
                fontWeight: 600,
                mb: "5px"
              }}>
              Username
            </Typography>
            <CustomTextField 
              id="username"
              variant="outlined" 
              fullWidth 
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </Box>
          <Box sx={{
            mt: "25px"
          }}>
            <Typography
              variant="subtitle1"
              component="label"
              htmlFor="password"
              sx={{
                fontWeight: 600,
                mb: "5px"
              }}>
              Password
            </Typography>
            <CustomTextField 
              id="password"
              type="password" 
              variant="outlined" 
              fullWidth 
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </Box>
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              my: 2
            }}>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Remeber this Device"
              />
            </FormGroup>
            <Typography
              component={Link}
              href="/"
              sx={{
                fontWeight: "500",
                textDecoration: "none",
                color: "primary.main"
              }}>
              Forgot Password ?
            </Typography>
          </Stack>
        </Stack>
        <Box>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                Iniciando sesión...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </Box>
      </form>
      
      {subtitle}
    </>
  );
};

export default AuthLogin;
