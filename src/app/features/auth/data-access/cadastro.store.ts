import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { RegisterRequest } from '../../../core/models/auth.model';
import { AuthService } from './auth.service';

type CadastroState = {
  loading: boolean;
  sucesso: boolean;
  error: string | null;
};

const initialState: CadastroState = {
  loading: false,
  sucesso: false,
  error: null,
};

// Cadastro é uma ação (POST), então usa rxMethod, como o login.
// Este store NÃO é providedIn root: o RegisterComponent o declara em
// `providers`, então cada visita à tela começa com estado limpo.
export const CadastroStore = signalStore(
  withState(initialState),
  withMethods((store, authService = inject(AuthService)) => ({
    cadastrar: rxMethod<RegisterRequest>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null, sucesso: false })),
        switchMap((dados) =>
          authService.register(dados).pipe(
            tap(() => patchState(store, { loading: false, sucesso: true })),
            catchError((erro: HttpErrorResponse) => {
              const mensagem =
                erro.status === 0
                  ? 'Não foi possível conectar ao servidor. Tente novamente.'
                  : (erro.error?.mensagem ?? 'Não foi possível criar a conta.');
              patchState(store, { loading: false, error: mensagem });
              return of(null);
            }),
          ),
        ),
      ),
    ),
  })),
);