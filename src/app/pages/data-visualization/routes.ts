import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./data-visualization.component').then(m => m.DataVisualizationComponent),
    data: {
      title: $localize`Data Visualization`
    }
  }
];

