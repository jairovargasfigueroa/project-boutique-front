// Tipos para consulta con lenguaje natural

export interface ConsultaNaturalRequest {
  query: string;
  user_email?: string;
}

export interface ConsultaNaturalResponse {
  message: string;
  status: string;
}

export interface ConsultaNaturalError {
  error: string;
  details?: string;
}
