import { Component, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CadastroStore } from '../data-access/cadastro.store';

function senhasIguais(controle: AbstractControl): ValidationErrors | null {
  const senha = controle.parent?.get('senha')?.value;
  return senha === controle.value ? null : { senhasDiferentes: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
  ],
  providers: [CadastroStore],
  templateUrl: './register.component.html',
  // Reaproveita o mesmo visual da tela de login.
  styleUrl: '../login/login.component.scss',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  protected readonly store = inject(CadastroStore);

  protected readonly mostrarSenha = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(72)]],
    confirmarSenha: ['', [Validators.required, senhasIguais]],
  });

  constructor() {
    // Se a senha mudar depois de preenchida a confirmação, revalida a confirmação.
    this.form.controls.senha.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.form.controls.confirmarSenha.updateValueAndValidity());

    // Cadastro ok -> manda para o login (que mostra o aviso de sucesso).
    effect(() => {
      if (this.store.sucesso()) {
        this.router.navigate(['/login'], { queryParams: { cadastro: 'ok' } });
      }
    });
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    const { nome, email, senha } = this.form.getRawValue();
    this.store.cadastrar({ nome, email, senha });
  }
}