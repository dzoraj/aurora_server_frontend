export interface SourceResponse {
  id: number;
  agentId: string;
  hostname: string;
  ipAddress: string | null;
  osType: string | null;
  agentVersion: string | null;
  isActive: boolean;
  lastHeartbeat: string | null;
  createdAt: string;
}
