import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AlertaSeveridade, AlertasDoBoleto } from '../../../core/models/alerta.model';
import { RiskBadgeComponent } from '../../../shared/ui/risk-badge/risk-badge.component';

@Component({
  selector: 'app-alertas-boleto-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CurrencyPipe,
    DatePipe,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    RiskBadgeComponent,
  ],
  templateUrl: './alertas-boleto-card.component.html',
  styleUrl: './alertas-boleto-card.component.scss',
})
export class AlertasBoletoCardComponent {
  grupo = input.required<AlertasDoBoleto>();

  protected severidadeRotulo(severidade: AlertaSeveridade): string {
    const rotulos: Record<AlertaSeveridade, string> = {
      BAIXA: 'Baixa',
      MEDIA: 'Média',
      ALTA: 'Alta',
    };
    return rotulos[severidade];
  }

  protected severidadeIcone(severidade: AlertaSeveridade): string {
    const icones: Record<AlertaSeveridade, string> = {
      BAIXA: 'info',
      MEDIA: 'warning',
      ALTA: 'gpp_maybe',
    };
    return icones[severidade];
  }

  // MUDANCA_DADOS_BANCARIOS -> "Mudanca dados bancarios"
  protected tipoRotulo(tipo: string): string {
    const texto = tipo.replace(/_/g, ' ').toLowerCase();
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  protected statusRotulo(status: string): string {
    return status.charAt(0) + status.slice(1).toLowerCase();
  }

  // 47 dígitos -> formato com pontos e espaços da linha digitável
  protected linhaFormatada(linha: string | null): string {
    if (!linha || linha.length !== 47) {
      return linha ?? '';
    }
    return (
      `${linha.slice(0, 5)}.${linha.slice(5, 10)} ${linha.slice(10, 15)}.${linha.slice(15, 21)} ` +
      `${linha.slice(21, 26)}.${linha.slice(26, 32)} ${linha.slice(32, 33)} ${linha.slice(33)}`
    );
  }
}