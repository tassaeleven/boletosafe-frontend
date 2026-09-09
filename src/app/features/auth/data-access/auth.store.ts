import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { LoginRequest } from '../../../core/models/auth.model';
import { AuthService } from './auth.service';

type AuthState = {
  token: string | null;
  nome: string | null;
  perfil: string | null;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  token: null,
  nome: null,
  perfil: null,
  loading: false,
  error: null,
};

// Login é uma ação disparada pelo usuário (POST), não uma leitura reativa,
// por isso usa rxMethod em vez de resource()/httpResource(). O padrão
// resource API aparece no AlertaStore, que é uma leitura (GET).
export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ token }) => ({
    isAuthenticated: computed(() => !!token()),
  })),
  withMethods((store, authService = inject(AuthService)) => ({
    login: rxMethod<LoginRequest>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((credenciais) =>
          authService.login(credenciais).pipe(
            tap((resposta) =>
              patchState(store, {
                token: resposta.token,
                nome: resposta.nome,
                perfil: resposta.perfil,
                loading: false,
              }),
            ),
            catchError(() => {
              patchState(store, { loading: false, error: 'E-mail ou senha inválidos' });
              return of(null);
            }),
          ),
        ),
      ),
    ),
    logout(): void {
      patchState(store, initialState);
    },
  })),
);
