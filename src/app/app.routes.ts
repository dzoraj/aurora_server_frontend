import { Routes } from '@angular/router';

import { MainLayout } from './layout/main-layout';
import { AlertsPage } from './features/alerts/pages/alerts-page/alerts-page';
import { DashboardPage } from './features/dashboard/pages/dashboard-page/dashboard-page';
import { IncidentsPage } from './features/incidents/pages/incidents-page/incidents-page';
import { LogEventsPage } from './features/log-events/pages/log-events-page/log-events-page';
import { RulesPage } from './features/rules/pages/rules-page/rules-page';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardPage },
      { path: 'alerts', component: AlertsPage },
      { path: 'rules', component: RulesPage },
      { path: 'incidents', component: IncidentsPage },
      { path: 'log-events', component: LogEventsPage }
    ]
  }
];
