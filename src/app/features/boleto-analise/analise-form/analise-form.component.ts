import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BoletoStore } from '../data-access/boleto.store';
import { AnaliseResultadoComponent } from '../analise-resultado/analise-resultado.component';

@Component({
  selector: 'app-analise-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AnaliseResultadoComponent,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
  ],
  templateUrl: './analise-form.component.html',
  styleUrl: './analise-form.component.scss',
})
export class AnaliseFormComponent {
  private readonly fb = inject(FormBuilder);
  protected readonly boletoStore = inject(BoletoStore);

  protected readonly form = this.fb.nonNullable.group({
    linhaDigitavel: ['', Validators.required],
    beneficiarioNome: ['', Validators.required],
    beneficiarioDocumento: ['', Validators.required],
    valorInformado: [0, [Validators.required, Validators.min(0.01)]],
    vencimentoInformado: ['', Validators.required],
  });

  protected onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    this.boletoStore.analisar(this.form.getRawValue());
  }
}
