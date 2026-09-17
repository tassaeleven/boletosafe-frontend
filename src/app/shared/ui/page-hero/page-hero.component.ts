import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { AuthStore } from '../../../features/auth/data-access/auth.store';

@Component({
  selector: 'app-page-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero">
      @if (authStore.nome()) {
        <p class="hero__saudacao">Olá, {{ authStore.nome() }}</p>
      }
      <h1 class="hero__titulo">{{ titulo() }}</h1>
      @if (subtitulo()) {
        <p class="hero__sub">{{ subtitulo() }}</p>
      }
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .hero {
      position: relative;
      overflow: hidden;
      margin-bottom: 24px;
      padding: 28px 28px 32px;
      border-radius: var(--mat-sys-corner-large);
      color: #fff;
      background: var(--bs-hero-gradient);
      box-shadow: var(--mat-sys-level1);
    }

    // Arcos decorativos sutis, ecoando o gráfico ondulado de apps bancários.
    .hero::before,
    .hero::after {
      content: '';
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.08);
      pointer-events: none;
    }

    .hero::before {
      width: 220px;
      height: 220px;
      top: -120px;
      right: -60px;
    }

    .hero::after {
      width: 160px;
      height: 160px;
      bottom: -100px;
      right: 60px;
      background: rgba(255, 255, 255, 0.06);
    }

    .hero__saudacao {
      position: relative;
      z-index: 1;
      margin: 0 0 4px;
      color: rgba(255, 255, 255, 0.85);
      font: var(--mat-sys-label-large);
    }

    .hero__titulo {
      position: relative;
      z-index: 1;
      margin: 0;
      font: var(--mat-sys-headline-small);
      font-weight: 700;
    }

    .hero__sub {
      position: relative;
      z-index: 1;
      max-width: 46ch;
      margin: 6px 0 0;
      color: rgba(255, 255, 255, 0.85);
      font: var(--mat-sys-body-medium);
    }
  `,
})
export class PageHeroComponent {
  protected readonly authStore = inject(AuthStore);

  titulo = input.required<string>();
  subtitulo = input<string | null>(null);
}
