import { ApplicationConfig, EnvironmentProviders, Provider, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { authInterceptor, provideAuth, withAppInitializerAuthCheck } from 'angular-auth-oidc-client';

import { routes } from './app.routes';
import { createAuthConfig } from './auth/auth.config';
import { environment } from '../environments/environment';

const authProviders: Array<Provider | EnvironmentProviders> = environment.authEnabled
  ? [provideAuth(createAuthConfig(), withAppInitializerAuthCheck())]
  : [];

export const appConfig: ApplicationConfig = {
  providers: [
    ...authProviders,
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors(environment.authEnabled ? [authInterceptor()] : [])
    )
  ]
};
