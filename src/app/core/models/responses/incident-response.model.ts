export interface IncidentResponse {
  id: number;
  title: string;
  description: string | null;
  severity: string | null;
  status: string | null;
  assignedTo: string | null;
  timeline: string | null;
  alertIds: number[];
  createdAt: string;
  resolvedAt: string | null;
}
