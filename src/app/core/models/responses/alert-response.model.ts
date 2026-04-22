export interface AlertResponse {
  id: number;
  ruleName: string;
  sourceId: string;
  severity: string;
  status: string;
  message: string | null;
  assignedTo: string | null;
  investigationNotes: string | null;
  createdAt: string;
  resolvedAt: string | null;
}
