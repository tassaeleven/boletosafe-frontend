import { computed } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { environment } from '../../../../environments/environment';
import { Alerta, AlertaStatus } from '../../../core/models/alerta.model';

type AlertaFiltro = {
  status: AlertaStatus | null;
};

const initialState: AlertaFiltro = { status: null };

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

    return {
      alertas: computed(() => alertasResource.value() ?? []),
      carregando: alertasResource.isLoading,
      erro: computed(() =>
        alertasResource.error() ? 'Não foi possível carregar os alertas' : null,
      ),
      recarregar: () => alertasResource.reload(),
    };
  }),
);
