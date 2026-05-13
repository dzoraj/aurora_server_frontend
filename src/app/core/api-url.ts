import { environment } from '../../environments/environment';

/** Builds an absolute API URL, '/api/alerts' ->> 'http://localhost:8080/api/alerts' in dev. */
export function apiUrl(path: string): string {
  const base = environment.apiUrl.replace(/\/$/, '');
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${base}${suffix}`;
}
