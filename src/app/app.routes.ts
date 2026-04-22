import { Routes } from '@angular/router';
import { AlertsPage } from './features/alerts/pages/alerts-page/alerts-page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'alerts',
    pathMatch: 'full'
  },
  {
    path: 'alerts',
    component: AlertsPage
  }
];