export type CoachMode = 'closed' | 'mini' | 'expanded';
export type CoachStatus = 'idle' | 'watching' | 'active';

export type CoachMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  learningMode?: boolean;
  createdAt?: string;
};

export type CoachSignals = {
  learningMode: boolean;
  reasons?: string[];
};

export type CoachProfile = {
  id: string;
  name: string;
  goals?: string;
  subjects?: string[];
  learningStyle?: string;
  attentionSpan?: string;
  pastStruggles?: string[];
};

export type TopicProgress = {
  topic: string;
  confidence: number;
  lastStatus: 'struggling' | 'steady' | 'improving';
  updatedAt?: string;
};
