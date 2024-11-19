import { Routes } from '@angular/router';
import { AuthGuard } from './libs/guards';
import { CleanLayoutComponent, DefaultLayoutComponent } from './layouts';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '-/dsb',
    pathMatch: 'full'
  },
  {
    path: '',
    component: CleanLayoutComponent,
    children: [
      {
        path: 'sign-in',
        loadChildren: () => import('./pages/sign-in/routes').then((m) => m.routes)
      },
      {
        path: 'register',
        loadChildren: () => import('./pages/register/routes').then((m) => m.routes)
      }
    ]
  },
  {
    path: '-',
    canActivate: [AuthGuard],
    component: DefaultLayoutComponent,
    data: {
      title: 'Home',
    },
    children: [
      {
        path: 'dsb',
        loadChildren: () => import('./pages/dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'frp',
        loadChildren: () => import('./pages/file-repository/routes').then((m) => m.routes)
      },
      {
        path: 'eds',
        loadChildren: () => import('./pages/external-data-source/routes').then((m) => m.routes)
      },
      {
        path: 'dqp',
        loadChildren: () => import('./pages/data-query-pipeline/routes').then((m) => m.routes)
      },
      {
        path: 'dmg',
        loadChildren: () => import('./pages/dataset-management/routes').then((m) => m.routes)
      },
      {
        path: 'dvz',
        loadChildren: () => import('./pages/data-visualization/routes').then((m) => m.routes)
      },
    ]
  },
  {
    path: '404',
    loadComponent: () => import('../old-refs/views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('../old-refs/views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('../old-refs/views/pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    loadComponent: () => import('../old-refs/views/pages/register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Register Page'
    }
  },
  { path: '**', redirectTo: 'dashboard' }
];
