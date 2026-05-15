
export type NodeType = 'process' | 'resource';

export interface GridNode {
  id: string;
  type: NodeType;
  label: string;
  x: number;
  y: number;
  status: 'normal' | 'waiting' | 'deadlocked' | 'running';
  color?: string;
}

export interface GridEdge {
  id: string;
  from: string; // id of node
  to: string; // id of node
  type: 'holds' | 'requests';
  status: 'active' | 'waiting' | 'deadlocked';
}

export interface SimulationLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

export type ScenarioPreset = 'scenario1' | 'scenario2' | 'scenario3' | 'custom';
export type AlgorithmType = 'detection' | 'prevention' | 'avoidance';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
