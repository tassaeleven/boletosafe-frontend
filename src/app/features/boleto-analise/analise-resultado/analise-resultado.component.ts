import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BoletoAnaliseResultado } from '../../../core/models/boleto.model';
import { RiskBadgeComponent } from '../../../shared/ui/risk-badge/risk-badge.component';

// O BoletoSafe adota o Angular 21 por ser a versão estável mais recente do framework, trazendo maturidade total dos standalone components (sem NgModules), da nova resource API para leituras assíncronas e de melhorias de performance no motor de change detection. Isso simplifica a arquitetura do projeto, reduz boilerplate e mantém o frontend alinhado com as práticas mais atuais do ecossistema Angular, o que é relevante para um protótipo acadêmico que pretende refletir decisões técnicas atualizadas.
//
// Quanto ao gerenciamento de estado, optamos por uma abordagem reativa com NgRx SignalStore porque o BoletoSafe lida com fluxos de dados que mudam com frequência e precisam refletir na interface de forma imediata e previsível: o estado de autenticação do usuário, o resultado da análise de risco de um boleto e a lista de alertas gerados pelo Risk Engine. Centralizar esses estados em stores reativos, baseados em signals, evita inconsistências entre componentes, facilita o rastreamento de mudanças e torna o código mais declarativo, já que a interface reage automaticamente sempre que um dado muda, sem necessidade de gerenciar manualmente subscriptions ou sincronizações entre telas.
//
// A camada visual usa o Angular Material (Design System Material 3) com tema
// personalizado em src/_theme-colors.scss e src/styles.scss.

@Component({
  selector: 'app-analise-resultado',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RiskBadgeComponent, MatCardModule, MatIconModule, MatProgressBarModule],
  templateUrl: './analise-resultado.component.html',
  styleUrl: './analise-resultado.component.scss',
})
export class AnaliseResultadoComponent {
  resultado = input.required<BoletoAnaliseResultado>();
}
