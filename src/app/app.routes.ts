import { Routes } from '@angular/router';
import { autoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';

import { environment } from '../environments/environment';
import { AuthCallbackComponent } from './auth/pages/auth-callback/auth-callback';
import { UnauthorizedComponent } from './auth/pages/unauthorized/unauthorized';
import { MainLayout } from './layout/main-layout';
import { AlertsPage } from './features/alerts/pages/alerts-page/alerts-page';
import { DashboardPage } from './features/dashboard/pages/dashboard-page/dashboard-page';
import { IncidentsPage } from './features/incidents/pages/incidents-page/incidents-page';
import { LogEventsPage } from './features/log-events/pages/log-events-page/log-events-page';
import { RulesPage } from './features/rules/pages/rules-page/rules-page';

const shellChildren = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' as const },
  { path: 'dashboard', component: DashboardPage },
  { path: 'alerts', component: AlertsPage },
  { path: 'rules', component: RulesPage },
  { path: 'incidents', component: IncidentsPage },
  { path: 'log-events', component: LogEventsPage }
];

const authEntryRoutes: Routes = environment.authEnabled
  ? [
      { path: 'callback', component: AuthCallbackComponent },
      { path: 'unauthorized', component: UnauthorizedComponent }
    ]
  : [];

export const routes: Routes = [
  ...authEntryRoutes,
  {
    path: '',
    component: MainLayout,
    ...(environment.authEnabled ? { canActivate: [autoLoginPartialRoutesGuard] } : {}),
    children: shellChildren
  }
];
