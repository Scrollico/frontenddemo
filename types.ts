
export type ViewState = 'onboarding' | 'dashboard';
export type DashboardTab = string; // e.g., 'daily', 'daily_podcast', 'market_heatmap'
export type MarketPriority = 'General' | 'Energy' | 'Finance' | 'Innovation' | 'Business' | 'Tech';

export interface HeatmapItem {
  sector: string;
  change: number; // Percentage
  volatility: 'Low' | 'Medium' | 'High';
}

export interface NicheTopic {
  topic: string;
  signal: 'Low' | 'Medium' | 'High';
  mentions: number;
  growth: string;
  insight?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: number;
  isLoading?: boolean;
}

export interface DailyBriefing {
  date: string;
  content: string; // Markdown content
  sources: string[];
}

export interface ContentDraft {
  id: string;
  type: 'linkedin' | 'talking-points';
  content: string;
  created: number;
}

export type AgentModel = 'gpt-4o' | 'gpt-4o-mini' | 'claude-3-5-sonnet' | 'claude-3-5-haiku';

export interface Agent {
  id: string;
  name: string;
  description?: string;
  systemPrompt?: string;
  model: AgentModel;
  createdAt: number;
}
