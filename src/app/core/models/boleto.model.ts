export interface BoletoAnaliseRequest {
  linhaDigitavel: string;
  beneficiarioNome: string;
  beneficiarioDocumento: string;
  valorInformado: number;
  vencimentoInformado: string;
  bancoInstituicaoId?: number;
  origemCobrancaId?: number;
}

export type NivelRisco = 'BAIXO' | 'ATENCAO' | 'ALTO';

export interface BoletoAnaliseResultado {
  id: number;
  scoreTotal: number;
  nivelRisco: NivelRisco;
  observacoes: string;
  criadoEm: string;
}
