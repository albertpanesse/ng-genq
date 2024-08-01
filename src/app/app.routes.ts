import { Routes } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { FileManagerComponent } from './pages/file-manager/file-manager.component';
import { QueryPanelComponent } from './pages/query-panel/query-panel.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dash', component: DashboardComponent },
  { path: 'file-mgr', component: FileManagerComponent },
  { path: 'qry-pnl', component: QueryPanelComponent },
];
