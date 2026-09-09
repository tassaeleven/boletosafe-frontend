export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  usuarioId: number;
  nome: string;
  perfil: string;
}
