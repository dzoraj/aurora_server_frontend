export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  /**
   * Set true after Keycloak is running and the `aurora-spa` client exists (see scripts/keycloak-setup.txt).
   * While false, the app behaves like before (no login screen, no Bearer token).
   */
  authEnabled: true,
  /** Must match Keycloak realm issuer (no trailing slash). */
  keycloakIssuer: 'http://localhost:8180/realms/aurora'
};
