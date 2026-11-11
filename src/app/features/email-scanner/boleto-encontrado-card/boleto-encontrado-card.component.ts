import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  inject,
  input,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BoletoEncontrado, StatusBoletoEncontrado } from '../../../core/models/email-scanner.model';

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
  desbloqueando = input<boolean>(false);
  erro = input<string | null>(null);

  @Output() desbloquear = new EventEmitter<string>();

  private readonly fb = inject(FormBuilder);

  protected readonly formSenha = this.fb.nonNullable.group({
    senha: ['', Validators.required],
  });

  protected onDesbloquear(): void {
    if (this.formSenha.invalid) {
      return;
    }
    this.desbloquear.emit(this.formSenha.controls.senha.value);
  }

  protected statusRotulo(status: StatusBoletoEncontrado): string {
    const rotulos: Record<StatusBoletoEncontrado, string> = {
      BLOQUEADO: 'Aguardando senha',
      ANALISADO: 'Enviado para análise',
      ERRO_EXTRACAO: 'Não foi possível ler',
    };
    return rotulos[status];
  }

  protected statusIcone(status: StatusBoletoEncontrado): string {
    const icones: Record<StatusBoletoEncontrado, string> = {
      BLOQUEADO: 'lock',
      ANALISADO: 'check_circle',
      ERRO_EXTRACAO: 'error_outline',
    };
    return icones[status];
  }
}