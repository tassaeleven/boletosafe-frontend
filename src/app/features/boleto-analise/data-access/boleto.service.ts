import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BoletoAnaliseRequest, BoletoAnaliseResultado } from '../../../core/models/boleto.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BoletoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.riskEngineApiUrl}/boleto`;

  analisar(payload: BoletoAnaliseRequest): Observable<BoletoAnaliseResultado> {
    return this.http.post<BoletoAnaliseResultado>(`${this.baseUrl}/analise`, payload);
  }
}
