import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  computed,
  inject,
  input,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  BoletoEncontrado,
  ResumoAnalise,
  StatusBoletoEncontrado,
} from '../../../core/models/email-scanner.model';

@Component({
  selector: 'app-boleto-encontrado-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    CurrencyPipe,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './boleto-encontrado-card.component.html',
  styleUrl: './boleto-encontrado-card.component.scss',
})
export class BoletoEncontradoCardComponent {
  boleto = input.required<BoletoEncontrado>();
  analise = input<ResumoAnalise | null>(null);
  desbloqueando = input<boolean>(false);
  erro = input<string | null>(null);

  @Output() desbloquear = new EventEmitter<string>();

  private readonly fb = inject(FormBuilder);

  protected readonly formSenha = this.fb.nonNullable.group({
    senha: ['', Validators.required],
  });

  // Só vale a pena mandar o usuário para "Alertas" quando o boleto é de risco.
  protected readonly exibirAvisoAlertas = computed(() => {
    const analise = this.analise();
    return !!analise && analise.nivelRisco !== 'BAIXO';
  });

  protected readonly chipClasse = computed(() => {
    const status = this.boleto().status;
    if (status !== 'ANALISADO') {
      return status.toLowerCase();
    }
    const analise = this.analise();
    return analise ? `risco-${analise.nivelRisco.toLowerCase()}` : 'analisando';
  });

  protected readonly chipRotulo = computed(() => {
    const status = this.boleto().status;
    if (status !== 'ANALISADO') {
      return this.statusRotulo(status);
    }
    switch (this.analise()?.nivelRisco) {
      case 'BAIXO':
        return 'Boleto seguro';
      case 'ATENCAO':
        return 'Risco de atenção';
      case 'ALTO':
        return 'Risco alto';
      default:
        return 'Analisando risco…';
    }
  });

  protected readonly icone = computed(() => {
    const status = this.boleto().status;
    if (status !== 'ANALISADO') {
      return this.statusIcone(status);
    }
    switch (this.analise()?.nivelRisco) {
      case 'BAIXO':
        return 'verified_user';
      case 'ATENCAO':
        return 'warning';
      case 'ALTO':
        return 'gpp_bad';
      default:
        return 'hourglass_top';
    }
  });

  protected onDesbloquear(): void {
    if (this.formSenha.invalid) {
      return;
    }
    this.desbloquear.emit(this.formSenha.controls.senha.value);
  }

  private statusRotulo(status: StatusBoletoEncontrado): string {
    const rotulos: Record<StatusBoletoEncontrado, string> = {
      BLOQUEADO: 'Aguardando senha',
      ANALISADO: 'Enviado para análise',
      ERRO_EXTRACAO: 'Não foi possível ler',
    };
    return rotulos[status];
  }

  private statusIcone(status: StatusBoletoEncontrado): string {
    const icones: Record<StatusBoletoEncontrado, string> = {
      BLOQUEADO: 'lock',
      ANALISADO: 'check_circle',
      ERRO_EXTRACAO: 'error_outline',
    };
    return icones[status];
  }
}