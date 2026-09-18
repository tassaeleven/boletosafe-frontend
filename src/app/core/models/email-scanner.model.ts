export type StatusBoletoEncontrado = 'BLOQUEADO' | 'ANALISADO' | 'ERRO_EXTRACAO';

// Bate exatamente com BoletoEncontradoResponse do email-scanner-service.
export interface BoletoEncontrado {
  id: number;
  remetente: string;
  assunto: string;
  nomeArquivoAnexo: string;
  status: StatusBoletoEncontrado;
  beneficiarioNomeExtraido: string | null;
  valorExtraido: number | null;
  vencimentoExtraido: string | null;
  criadoEm: string;
}

// Bate com CadastrarPerfilSenhaRequest — dados opcionais que o usuário
// cadastra para habilitar o "chute inteligente" de senha de PDF.
export interface CadastrarPerfilSenhaRequest {
  cpf: string;
  dataNascimento: string;
}

// Bate com DesbloquearBoletoRequest.
export interface DesbloquearBoletoRequest {
  senha: string;
}