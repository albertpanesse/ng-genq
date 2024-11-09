import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./external-data-source.component').then(m => m.ExternalDataSourceComponent),
    data: {
      title: $localize`External Data Source`
    }
  }
];

