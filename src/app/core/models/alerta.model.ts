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
}
