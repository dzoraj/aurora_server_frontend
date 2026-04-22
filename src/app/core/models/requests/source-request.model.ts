export interface SourceRequest {
  agentId: string;
  hostname: string;
  ipAddress?: string | null;
  osType?: string | null;
  agentVersion?: string | null;
  isActive?: boolean | null;
}
