import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dataset-management.component').then(m => m.DatasetManagementComponent),
    data: {
      title: $localize`Datasets`
    }
  }
];

