"use client";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Typography,
  Alert,
  Collapse,
} from "@mui/material";
import { IconMicrophone, IconSend, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { useConsultaNatural } from "@/hooks";

const ConsultaNaturalDashboard = () => {
  const [query, setQuery] = useState("");
  const [email, setEmail] = useState("");
  const [escuchando, setEscuchando] = useState(false);
  const { loading, error, resultado, generarReporte, limpiar } =
    useConsultaNatural();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      await generarReporte(query.trim(), email.trim() || undefined);
      // Limpiar los inputs después de enviar exitosamente
      setTimeout(() => {
        setQuery("");
        setEmail("");
      }, 3000);
    } catch (err) {
      // El error ya se maneja en el hook
    }
  };

  const iniciarReconocimiento = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge."
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setEscuchando(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setEscuchando(false);
    };

    recognition.onerror = () => {
      setEscuchando(false);
      alert("Error en el reconocimiento de voz");
    };

    recognition.onend = () => {
      setEscuchando(false);
    };

    recognition.start();
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" mb={2}>
          🎤 Generar Reporte con IA
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Genera un reporte de ventas usando lenguaje natural y recíbelo por
          correo electrónico.
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            {/* Campo de consulta con reconocimiento de voz */}
            <TextField
              fullWidth
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ej: Muéstrame las ventas del último mes por categoría"
              disabled={loading || escuchando}
              type="text"
              label="Muéstrame las ventas del último mes por categoría"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={iniciarReconocimiento}
                      disabled={loading}
                      color={escuchando ? "error" : "default"}
                      title="Reconocimiento de voz"
                    >
                      <IconMicrophone />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Campo de email */}
            <Box display="flex" gap={2} alignItems="start">
              <TextField
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu-email@ejemplo.com (opcional)"
                disabled={loading || escuchando}
                type="email"
                label="Correo Electrónico"
                helperText="Si no especificas un email, se enviará a garcia.brayan3001@gmail.com"
              />
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !query.trim() || escuchando}
                startIcon={<IconSend />}
                sx={{ minWidth: 140, height: 56 }}
              >
                {loading ? "Enviando..." : "Generar"}
              </Button>
            </Box>
          </Box>

          {/* Mensaje de éxito */}
          <Collapse in={!!resultado}>
            <Alert
              severity="success"
              sx={{ mt: 2 }}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={limpiar}
                >
                  <IconX />
                </IconButton>
              }
            >
              <Typography variant="body2">{resultado?.message}</Typography>
            </Alert>
          </Collapse>

          {/* Mensaje de error */}
          <Collapse in={!!error}>
            <Alert
              severity="error"
              sx={{ mt: 2 }}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={limpiar}
                >
                  <IconX />
                </IconButton>
              }
            >
              <Typography variant="body2">{error}</Typography>
            </Alert>
          </Collapse>

          {/* Estado de escucha */}
          <Collapse in={escuchando}>
            <Alert severity="info" sx={{ mt: 2 }}>
              🎤 Escuchando... habla ahora
            </Alert>
          </Collapse>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ConsultaNaturalDashboard;
