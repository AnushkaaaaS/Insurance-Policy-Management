export interface Agent {
  _id: string;
  name: string;
  email: string;
  role: "agent";
  isActive: boolean;
  createdAt: string;
}

export interface AgentResponse {
  currentPage: number;
  totalPages: number;
  totalAgents: number;
  agents: Agent[];
}

export interface AgentProfile {
  agent: Agent;
  summary: {
    customers: number;
    policies: number;
  };
}