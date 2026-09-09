import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NivelRisco } from '../../../core/models/boleto.model';

@Component({
  selector: 'app-risk-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <span class="badge" [class]="corClasse()">
      <mat-icon>{{ icone() }}</mat-icon>
      {{ rotulo() }}
    </span>
  `,
  styles: `
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px 6px 8px;
      border-radius: 999px;
      font: var(--mat-sys-label-large);
      font-weight: 600;
      white-space: nowrap;
    }

    .badge mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .risco-baixo {
      background: #e6f4ea;
      color: #1e5128;
    }

    .risco-atencao {
      background: #fdf0e1;
      color: #6b3b06;
    }

    .risco-alto {
      background: #fce8e8;
      color: #7a1f1f;
    }
  `,
})
export class RiskBadgeComponent {
  nivelRisco = input.required<NivelRisco>();

  protected readonly rotulo = computed(() => {
    const rotulos: Record<NivelRisco, string> = {
      BAIXO: 'Baixo risco',
      ATENCAO: 'Atenção',
      ALTO: 'Alto risco',
    };
    return rotulos[this.nivelRisco()];
  });

  protected readonly icone = computed(() => {
    const icones: Record<NivelRisco, string> = {
      BAIXO: 'check_circle',
      ATENCAO: 'warning',
      ALTO: 'gpp_maybe',
    };
    return icones[this.nivelRisco()];
  });

  protected readonly corClasse = computed(() => {
    const classes: Record<NivelRisco, string> = {
      BAIXO: 'risco-baixo',
      ATENCAO: 'risco-atencao',
      ALTO: 'risco-alto',
    };
    return classes[this.nivelRisco()];
  });
}
