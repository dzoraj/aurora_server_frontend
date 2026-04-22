export interface IncidentRequest {
  title: string;
  description?: string | null;
  severityId?: number | null;
  statusId?: number | null;
  assignedTo?: string | null;
  timeline?: string | null;
}
