import type { PassedInitialConfig } from 'angular-auth-oidc-client';

import { environment } from '../../environments/environment';

export function createAuthConfig(): PassedInitialConfig {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4200';
  const apiRoot = environment.apiUrl ? `${environment.apiUrl}/api` : '/api';

  return {
    config: {
      configId: 'aurora',
      authority: environment.keycloakIssuer,
      redirectUrl: `${origin}/callback`,
      postLogoutRedirectUri: origin,
      clientId: 'aurora-spa',
      responseType: 'code',
      scope: 'openid profile email offline_access',
      silentRenew: false,
      useRefreshToken: true,
      renewTimeBeforeTokenExpiresInSeconds: 30,
      secureRoutes: [apiRoot]
    }
  };
}
