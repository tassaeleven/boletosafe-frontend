import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AlertaSeveridade, AlertaStatus } from '../../../core/models/alerta.model';
import { AlertaStore } from '../data-access/alerta.store';
import { PageHeroComponent } from '../../../shared/ui/page-hero/page-hero.component';

@Component({
  selector: 'app-alertas-list',
  standalone: true,
  imports: [
    DatePipe,
    TitleCasePipe,
    PageHeroComponent,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './alertas-list.component.html',
  styleUrl: './alertas-list.component.scss',
})
export class AlertasListComponent {
  protected readonly alertaStore = inject(AlertaStore);

  protected readonly subtitulo = computed(() => {
    if (this.alertaStore.carregando()) {
      return 'Carregando alertas...';
    }
    const total = this.alertaStore.alertas().length;
    if (total === 0) {
      return 'Nenhuma ocorrência encontrada para este filtro.';
    }
    return `${total} ${total === 1 ? 'alerta encontrado' : 'alertas encontrados'} para este filtro.`;
  });

  protected readonly statusOpcoes: Array<{ valor: AlertaStatus | null; rotulo: string }> = [
    { valor: null, rotulo: 'Todos' },
    { valor: 'ABERTO', rotulo: 'Abertos' },
    { valor: 'VISUALIZADO', rotulo: 'Visualizados' },
    { valor: 'RESOLVIDO', rotulo: 'Resolvidos' },
  ];

  protected filtrar(status: AlertaStatus | null): void {
    this.alertaStore.filtrarPorStatus(status);
  }

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
}
