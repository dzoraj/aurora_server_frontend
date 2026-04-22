export interface RuleResponse {
  id: number;
  name: string;
  description: string | null;
  condition: string;
  status: string;
  defaultSeverity: string;
  enabled: boolean;
  alertMessage: string | null;
  createdAt: string;
  updatedAt: string;
}
