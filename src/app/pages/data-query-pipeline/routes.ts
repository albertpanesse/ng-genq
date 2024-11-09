import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./data-query-pipeline.component').then(m => m.DataQueryPipelineComponent),
    data: {
      title: $localize`Data Query Pipeline`
    }
  }
];

