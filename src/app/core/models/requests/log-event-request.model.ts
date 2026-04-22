export interface LogEventRequest {
  sourceId: number;
  message: string;
  severityId?: number | null;
  rawData?: string | null;
  timestamp?: string | null;
}
