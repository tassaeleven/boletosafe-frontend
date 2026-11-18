import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AlertaStatus } from '../../../core/models/alerta.model';
import { AlertaStore } from '../data-access/alerta.store';
import { AlertasBoletoCardComponent } from '../alertas-boleto-card/alertas-boleto-card.component';
import { PageHeroComponent } from '../../../shared/ui/page-hero/page-hero.component';

@Component({
  selector: 'app-alertas-list',
  standalone: true,
  imports: [
    AlertasBoletoCardComponent,
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
    const alertas = this.alertaStore.alertas().length;
    if (alertas === 0) {
      return 'Nenhuma ocorrência encontrada para este filtro.';
    }
    const boletos = this.alertaStore.boletosComAlertas().length;
    return (
      `${alertas} ${alertas === 1 ? 'alerta' : 'alertas'} em ` +
      `${boletos} ${boletos === 1 ? 'boleto' : 'boletos'} para este filtro.`
    );
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
}