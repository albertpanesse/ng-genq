import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./file-repository.component').then(m => m.FileRepositoryComponent),
    data: {
      title: $localize`Repository`
    }
  }
];

