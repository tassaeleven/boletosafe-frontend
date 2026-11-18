import { computed, inject } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  BoletoEncontrado,
  CadastrarPerfilSenhaRequest,
} from '../../../core/models/email-scanner.model';
import { EmailScannerService } from './email-scanner.service';

type EmailScannerState = {
  boletosSincronizados: BoletoEncontrado[] | null;
  sincronizando: boolean;
  erroSincronizacao: string | null;
  desbloqueandoId: number | null;
  erroDesbloqueioId: number | null;
  erroDesbloqueio: string | null;
  salvandoPerfilSenha: boolean;
  perfilSenhaSalvo: boolean;
  erroPerfilSenha: string | null;
};

const initialState: EmailScannerState = {
  boletosSincronizados: null,
  sincronizando: false,
  erroSincronizacao: null,
  desbloqueandoId: null,
  erroDesbloqueioId: null,
  erroDesbloqueio: null,
  salvandoPerfilSenha: false,
  perfilSenhaSalvo: false,
  erroPerfilSenha: null,
};

// GET /boletos é leitura -> httpResource() (mesmo padrão do AlertaStore).
// A resposta do POST /sincronizar já traz a lista completa do usuário, então ela
// tem prioridade na tela (boletosSincronizados); o GET cobre a abertura da página.
export const EmailScannerStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ boletosSincronizados }) => {
    const boletosResource = httpResource<BoletoEncontrado[]>(
      () => `${environment.emailScannerApiUrl}/email-scanner/boletos`,
    );

    return {
      boletos: computed(
        () => boletosSincronizados() ?? (boletosResource.hasValue() ? boletosResource.value() : []),
      ),
      carregandoLista: computed(
        () => boletosSincronizados() === null && boletosResource.isLoading(),
      ),
      erroLista: computed(() =>
        boletosSincronizados() === null && boletosResource.error()
          ? 'Não foi possível carregar os boletos encontrados.'
          : null,
      ),
      recarregar: () => boletosResource.reload(),
    };
  }),
  withMethods((store, emailScannerService = inject(EmailScannerService)) => ({
    sincronizar: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { sincronizando: true, erroSincronizacao: null })),
        switchMap((usuarioId) =>
          emailScannerService.sincronizar(usuarioId).pipe(
            tap((boletos) => {
              patchState(store, { sincronizando: false, boletosSincronizados: boletos });
              store.recarregar();
            }),
            catchError(() => {
              patchState(store, {
                sincronizando: false,
                erroSincronizacao:
                  'Não foi possível sincronizar com o Gmail. Verifique se sua conta Google está conectada.',
              });
              return of(null);
            }),
          ),
        ),
      ),
    ),

    cadastrarPerfilSenha: rxMethod<CadastrarPerfilSenhaRequest>(
      pipe(
        tap(() =>
          patchState(store, {
            salvandoPerfilSenha: true,
            erroPerfilSenha: null,
            perfilSenhaSalvo: false,
          }),
        ),
        switchMap((payload) =>
          emailScannerService.cadastrarPerfilSenha(payload).pipe(
            tap(() => patchState(store, { salvandoPerfilSenha: false, perfilSenhaSalvo: true })),
            catchError(() => {
              patchState(store, {
                salvandoPerfilSenha: false,
                erroPerfilSenha: 'Não foi possível salvar seus dados.',
              });
              return of(null);
            }),
          ),
        ),
      ),
    ),

    desbloquear: rxMethod<{ id: number; senha: string }>(
      pipe(
        tap(({ id }) =>
          patchState(store, { desbloqueandoId: id, erroDesbloqueioId: null, erroDesbloqueio: null }),
        ),
        switchMap(({ id, senha }) =>
          emailScannerService.desbloquear(id, { senha }).pipe(
            tap((atualizado) => {
              patchState(store, (estado) => ({
                desbloqueandoId: null,
                boletosSincronizados:
                  estado.boletosSincronizados?.map((b) => (b.id === atualizado.id ? atualizado : b)) ??
                  null,
              }));
              store.recarregar();
            }),
            catchError(() => {
              patchState(store, {
                desbloqueandoId: null,
                erroDesbloqueioId: id,
                erroDesbloqueio: 'Senha incorreta ou o PDF não pôde ser lido.',
              });
              return of(null);
            }),
          ),
        ),
      ),
    ),
  })),
);