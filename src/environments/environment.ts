export const environment = {
  production: true,
  /** Same-origin '/api/...' when UI and API share one host */
  apiUrl: '',
  /**
   * Set true when your production Keycloak is configured. Until then, keep false
   * so the SPA can be hosted without OIDC.
   */
  authEnabled: false,
  /** e.g. https://auth.example.com/realms/aurora — required when authEnabled is true */
  keycloakIssuer: ''
};
