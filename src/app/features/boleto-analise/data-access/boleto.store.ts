import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { BoletoAnaliseRequest, BoletoAnaliseResultado } from '../../../core/models/boleto.model';
import { BoletoService } from './boleto.service';

type BoletoState = {
  resultado: BoletoAnaliseResultado | null;
  loading: boolean;
  error: string | null;
};

const initialState: BoletoState = {
  resultado: null,
  loading: false,
  error: null,
};

// api/v1/boleto/analise é POST (ação do usuário), então o método usa
// rxMethod. Leituras (ex.: AlertaStore) usam httpResource().
export const BoletoStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, boletoService = inject(BoletoService)) => ({
    analisar: rxMethod<BoletoAnaliseRequest>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null, resultado: null })),
        switchMap((dadosBoleto) =>
          boletoService.analisar(dadosBoleto).pipe(
            tap((resultado) => patchState(store, { resultado, loading: false })),
            catchError(() => {
              patchState(store, {
                loading: false,
                error: 'Não foi possível analisar o boleto. Tente novamente.',
              });
              return of(null);
            }),
          ),
        ),
      ),
    ),
    limpar(): void {
      patchState(store, initialState);
    },
  })),
);
