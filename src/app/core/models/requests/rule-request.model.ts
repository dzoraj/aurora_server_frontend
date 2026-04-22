export interface RuleRequest {
  name: string;
  description?: string | null;
  condition: string;
  statusId?: number | null;
  defaultSeverityId?: number | null;
  enabled?: boolean | null;
  alertMessage?: string | null;
}
