import { NivelRisco } from './boleto.model';

export type AlertaSeveridade = 'BAIXA' | 'MEDIA' | 'ALTA';
export type AlertaStatus = 'ABERTO' | 'VISUALIZADO' | 'RESOLVIDO';

export interface Alerta {
  id: number;
  analiseRiscoId: number;
  tipo: string;
  descricao: string;
  severidade: AlertaSeveridade;
  status: AlertaStatus;
  criadoEm: string;
  linhaDigitavel: string | null;
  beneficiarioNome: string | null;
  beneficiarioDocumento: string | null;
  valor: number;
  vencimento: string;
  scoreTotal: number;
  nivelRisco: NivelRisco;
}

// Um boleto analisado com todos os alertas que ele gerou.
export interface AlertasDoBoleto {
  analiseRiscoId: number;
  linhaDigitavel: string | null;
  beneficiarioNome: string | null;
  beneficiarioDocumento: string | null;
  valor: number;
  vencimento: string;
  scoreTotal: number;
  nivelRisco: NivelRisco;
  alertas: Alerta[];
}