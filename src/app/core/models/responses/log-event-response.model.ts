export interface LogEventResponse {
  id: number;
  sourceId: number;
  message: string;
  severity: string | null;
  rawData: string | null;
  timestamp: string;
  createdAt: string;
}
