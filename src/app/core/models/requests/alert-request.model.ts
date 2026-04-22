export interface AlertRequest {
  ruleId: number;
  logEventId: number;
  sourceId: number;
  severityId: number;
  statusId: number;
  message?: string | null;
  assignedTo?: string | null;
  investigationNotes?: string | null;
}
