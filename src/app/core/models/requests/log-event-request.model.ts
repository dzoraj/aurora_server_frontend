/**
 * POST/PUT body for `/api/log-events`.
 * `timestamp`: ISO-8601 instant or offset datetime (e.g. from `new Date().toISOString()`). Omit or null to let the server set the time.
 */
export interface LogEventRequest {
  sourceId: number;
  message: string;
  severityId?: number | null;
  rawData?: string | null;
  /** ISO-8601 with `Z` or offset, e.g. `2026-05-14T20:48:17.123Z` */
  timestamp?: string | null;
}
