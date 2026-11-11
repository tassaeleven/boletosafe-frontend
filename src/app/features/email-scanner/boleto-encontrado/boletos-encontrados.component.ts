import { Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthStore } from '../../auth/data-access/auth.store';
import { EmailScannerStore } from '../data-access/email-scanner.store';
import { BoletoEncontradoCardComponent } from '../boleto-encontrado-card/boleto-encontrado-card.component';
import { PageHeroComponent } from '../../../shared/ui/page-hero/page-hero.component';

@Component({
  selector: 'app-boletos-encontrados',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PageHeroComponent,
    BoletoEncontradoCardComponent,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
  ],
  templateUrl: './boletos-encontrados.component.html',
  styleUrl: './boletos-encontrados.component.scss',
})
export class BoletosEncontradosComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authStore = inject(AuthStore);
  protected readonly emailScannerStore = inject(EmailScannerStore);

  protected readonly subtitulo = computed(() => {
    if (this.emailScannerStore.carregandoLista()) {
      return 'Carregando boletos encontrados...';
    }
    const total = this.emailScannerStore.boletos().length;
    if (total === 0) {
      return 'Sincronize com o Gmail para encontrar boletos recebidos por e-mail.';
    }
    return `${total} ${total === 1 ? 'boleto encontrado' : 'boletos encontrados'} no seu e-mail.`;
  });

  protected readonly formPerfilSenha = this.fb.nonNullable.group({
    cpf: ['', Validators.required],
    dataNascimento: ['', Validators.required],
  });

  protected sincronizar(): void {
    const usuarioId = this.authStore.usuarioId();
    if (usuarioId == null) {
      return;
    }
    this.emailScannerStore.sincronizar(usuarioId);
  }

  protected onSalvarPerfilSenha(): void {
    if (this.formPerfilSenha.invalid) {
      return;
    }
    this.emailScannerStore.cadastrarPerfilSenha(this.formPerfilSenha.getRawValue());
  }

  protected onDesbloquear(id: number, senha: string): void {
    this.emailScannerStore.desbloquear({ id, senha });
  }

  protected desbloqueandoId(id: number): boolean {
    return this.emailScannerStore.desbloqueandoId() === id;
  }

  protected erroDoBoleto(id: number): string | null {
    return this.emailScannerStore.erroDesbloqueioId() === id
      ? this.emailScannerStore.erroDesbloqueio()
      : null;
  }
}