import { computed } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { environment } from '../../../../environments/environment';
import {
  Alerta,
  AlertaSeveridade,
  AlertasDoBoleto,
  AlertaStatus,
} from '../../../core/models/alerta.model';

type AlertaFiltro = {
  status: AlertaStatus | null;
};

const initialState: AlertaFiltro = { status: null };

const pesoSeveridade: Record<AlertaSeveridade, number> = { ALTA: 3, MEDIA: 2, BAIXA: 1 };

// Listagem de alertas é uma leitura simples (GET) que reage a um filtro:
// aqui sim usamos o padrão resource API (httpResource), como pedido.
export const AlertaStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    filtrarPorStatus(status: AlertaStatus | null): void {
      patchState(store, { status });
    },
  })),
  withComputed((store) => {
    const alertasResource = httpResource<Alerta[]>(() => {
      const status = store.status();
      return {
        url: `${environment.riskEngineApiUrl}/boleto/alertas`,
        params: status ? { status } : undefined,
      };
    });

    const alertas = computed(() => alertasResource.value() ?? []);

    // Agrupa os alertas pelo boleto analisado (analiseRiscoId): análise mais recente
    // primeiro e, dentro de cada boleto, os alertas mais graves primeiro.
    const boletosComAlertas = computed<AlertasDoBoleto[]>(() => {
      const grupos = new Map<number, AlertasDoBoleto>();

      for (const alerta of alertas()) {
        let grupo = grupos.get(alerta.analiseRiscoId);
        if (!grupo) {
          grupo = {
            analiseRiscoId: alerta.analiseRiscoId,
            linhaDigitavel: alerta.linhaDigitavel,
            beneficiarioNome: alerta.beneficiarioNome,
            beneficiarioDocumento: alerta.beneficiarioDocumento,
            valor: alerta.valor,
            vencimento: alerta.vencimento,
            scoreTotal: alerta.scoreTotal,
            nivelRisco: alerta.nivelRisco,
            alertas: [],
          };
          grupos.set(alerta.analiseRiscoId, grupo);
        }
        grupo.alertas.push(alerta);
      }

      return [...grupos.values()]
        .map((grupo) => ({
          ...grupo,
          alertas: [...grupo.alertas].sort(
            (a, b) => pesoSeveridade[b.severidade] - pesoSeveridade[a.severidade],
          ),
        }))
        .sort((a, b) => b.analiseRiscoId - a.analiseRiscoId);
    });

    return {
      alertas,
      boletosComAlertas,
      carregando: alertasResource.isLoading,
      erro: computed(() =>
        alertasResource.error() ? 'Não foi possível carregar os alertas' : null,
      ),
      recarregar: () => alertasResource.reload(),
    };
  }),
);