import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  BoletoEncontrado,
  CadastrarPerfilSenhaRequest,
  DesbloquearBoletoRequest,
} from '../../../core/models/email-scanner.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EmailScannerService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.emailScannerApiUrl}/email-scanner`;

  // POST /api/v1/email-scanner/sincronizar?usuarioId=...
  // usuarioId ainda vai por query param (não pelo JWT) porque esse endpoint
  // depende da sessão OAuth2 com o Google, separada do JWT do Auth Service
  // — é a simplificação documentada no README do backend.
  sincronizar(usuarioId: number): Observable<BoletoEncontrado[]> {
    return this.http.post<BoletoEncontrado[]>(`${this.baseUrl}/sincronizar`, null, {
      params: { usuarioId },
    });
  }

  cadastrarPerfilSenha(payload: CadastrarPerfilSenhaRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/perfil-senha`, payload);
  }

  desbloquear(id: number, payload: DesbloquearBoletoRequest): Observable<BoletoEncontrado> {
    return this.http.post<BoletoEncontrado>(`${this.baseUrl}/boletos/${id}/desbloquear`, payload);
  }
}