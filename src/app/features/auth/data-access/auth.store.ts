import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { LoginRequest } from '../../../core/models/auth.model';
import { AuthService } from './auth.service';

type AuthState = {
  token: string | null;
  usuarioId: number | null;
  nome: string | null;
  perfil: string | null;
  loading: boolean;
  error: string | null;
};

type SessaoSalva = Pick<AuthState, 'token' | 'usuarioId' | 'nome' | 'perfil'>;

const CHAVE_SESSAO = 'boletosafe.sessao';

// O login do Google é um redirect de página inteira (sai do Angular e volta),
// então o estado em memória se perde. Guardamos a sessão no sessionStorage,
// que vale só para esta aba e some ao fechá-la.
function lerSessao(): SessaoSalva | null {
  try {
    const bruto = sessionStorage.getItem(CHAVE_SESSAO);
    return bruto ? (JSON.parse(bruto) as SessaoSalva) : null;
  } catch {
    return null;
  }
}

function salvarSessao(sessao: SessaoSalva): void {
  try {
    sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
  } catch {
    // storage indisponível: segue só em memória
  }
}

function limparSessao(): void {
  try {
    sessionStorage.removeItem(CHAVE_SESSAO);
  } catch {
    // ignora
  }
}

const initialState: AuthState = {
  token: null,
  usuarioId: null,
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
  withState<AuthState>(() => ({ ...initialState, ...lerSessao() })),
  withComputed(({ token }) => ({
    isAuthenticated: computed(() => !!token()),
  })),
  withMethods((store, authService = inject(AuthService)) => ({
    login: rxMethod<LoginRequest>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((credenciais) =>
          authService.login(credenciais).pipe(
            tap((resposta) => {
              patchState(store, {
                token: resposta.token,
                usuarioId: resposta.usuarioId,
                nome: resposta.nome,
                perfil: resposta.perfil,
                loading: false,
              });
              salvarSessao({
                token: resposta.token,
                usuarioId: resposta.usuarioId,
                nome: resposta.nome,
                perfil: resposta.perfil,
              });
            }),
            catchError(() => {
              patchState(store, { loading: false, error: 'E-mail ou senha inválidos' });
              return of(null);
            }),
          ),
        ),
      ),
    ),
    logout(): void {
      limparSessao();
      patchState(store, initialState);
    },
  })),
);