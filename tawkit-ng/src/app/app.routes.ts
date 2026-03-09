import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'display',
    pathMatch: 'full',
  },
  {
    path: 'display',
    loadComponent: () =>
      import('./features/display/display.component').then(m => m.DisplayComponent),
  },
  {
    path: '**',
    redirectTo: 'display',
  },
];
