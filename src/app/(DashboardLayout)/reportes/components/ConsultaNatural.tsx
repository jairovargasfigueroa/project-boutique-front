"use client";
import {
  Box,
  Button,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { IconMicrophone, IconSearch } from "@tabler/icons-react";
import { useState } from "react";

interface Props {
  onQuery: (query: string) => void;
  loading?: boolean;
}

const ConsultaNatural = ({ onQuery, loading }: Props) => {
  const [query, setQuery] = useState("");
  const [escuchando, setEscuchando] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onQuery(query.trim());
    }
  };

  const iniciarReconocimiento = () => {
    // Verificar compatibilidad
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
    <Box component="form" onSubmit={handleSubmit} display="flex" gap={1}>
      <TextField
        fullWidth
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ej: ventas del mes pasado mayores a 1000"
        disabled={loading || escuchando}
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
      <Button
        type="submit"
        variant="contained"
        disabled={loading || !query.trim() || escuchando}
        startIcon={<IconSearch />}
      >
        {loading ? "Consultando..." : "Consultar"}
      </Button>
    </Box>
  );
};

export default ConsultaNatural;
