import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    // Área autenticada: todas as telas ficam dentro do shell (barra + navegação).
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./core/layout/shell.component').then((m) => m.ShellComponent),
    children: [
      {
        path: 'boletos/analise',
        loadComponent: () =>
          import('./features/boleto-analise/analise-form/analise-form.component').then(
            (m) => m.AnaliseFormComponent,
          ),
      },
      {
        path: 'alertas',
        loadComponent: () =>
          import('./features/alertas/alertas-list/alertas-list.component').then(
            (m) => m.AlertasListComponent,
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
