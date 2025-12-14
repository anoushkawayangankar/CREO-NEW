'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

export type CoachMessage = {
  id: string;
  role: 'assistant' | 'user';
  content: string;
};

export type ModuleCoachContext = {
  course: string;
  difficulty: string;
  currentModule: string;
  currentTopics: string[];
  userProgress?: string;
  lastQuizResult?: string;
};

const DEFAULT_PROFILE = {
  name: 'Explorer',
  subjects: ['fundamentals'],
  goals: 'Stay curious and build momentum',
  learningStyle: 'examples',
  attentionSpan: 'medium',
  pastStruggles: ['motivation']
};

export const MINI_COACH_GREETING = 'I’m here to help you with this module. What’s confusing you?';

const buildSystemPrompt = (context: ModuleCoachContext) => {
  return `You are the user's personal learning coach for CREO.
You are currently assisting with the module: ${context.currentModule}.

Rules:
- Only answer questions related to the current module or prerequisites
- Use simple explanations first, then deeper ones if asked
- Use examples relevant to the user's skill level (${context.difficulty})
- If the question is outside scope, gently redirect back
- Never repeat content already covered unless the user is confused`;
};

type UseCoachSessionProps = {
  moduleId?: string;
  open: boolean;
  context?: ModuleCoachContext | null;
};

export function useCoachSession({ moduleId, open, context }: UseCoachSessionProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastModuleRef = useRef<string | null>(null);
  const greetedRef = useRef(false);

  const topicKey = useMemo(() => {
    if (!context && moduleId) return `module:${moduleId}`;
    if (!context) return undefined;
    return `module:${context.course}::${context.currentModule}`;
  }, [context, moduleId]);

  useEffect(() => {
    let cancelled = false;

    const hydrateUser = async () => {
      if (typeof window === 'undefined') return;
      try {
        const storedId = localStorage.getItem('creoTutorUserId');
        if (storedId) {
          const res = await fetch(`/api/users?id=${storedId}`);
          const payload = await res.json().catch(() => ({ success: false }));
          if (!cancelled && payload.success) {
            setUserId(storedId);
            return;
          }
        }

        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(DEFAULT_PROFILE)
        });
        const payload = await res.json().catch(() => ({ success: false }));
        const id = payload?.data?.profile?.id;
        if (!cancelled && id) {
          setUserId(id);
          localStorage.setItem('creoTutorUserId', id);
        }
      } catch (err) {
        console.error('Mini coach: failed to hydrate profile', err);
        if (!cancelled) {
          setError('Coach is temporarily unavailable. Try again.');
        }
      }
    };

    hydrateUser();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!moduleId || lastModuleRef.current === moduleId) return;
    lastModuleRef.current = moduleId;
    greetedRef.current = false;
    setMessages([]);
    setInput('');
    setError(null);
  }, [moduleId]);

  useEffect(() => {
    if (!open || !moduleId || greetedRef.current) return;
    greetedRef.current = true;
    setMessages((prev) => {
      const hasGreeting = prev.some((msg) => msg.content === MINI_COACH_GREETING);
      if (hasGreeting) return prev;
      return [
        ...prev,
        {
          id: `mini-coach-greeting-${moduleId}`,
          role: 'assistant',
          content: MINI_COACH_GREETING
        }
      ];
    });
  }, [open, moduleId]);

  const sendMessage = async (override?: string) => {
    const text = (override ?? input).trim();
    if (!text || !userId || !moduleId) return;
    const contextPayload = context
      ? {
          ...context,
          currentTopics: context.currentTopics || []
        }
      : undefined;

    const userMessage: CoachMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setPending(true);
    setError(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          message: text,
          topic: topicKey,
          mode: 'module-help',
          context: contextPayload,
          systemPrompt: contextPayload ? buildSystemPrompt(contextPayload) : undefined
        })
      });

      if (!res.ok) {
        throw new Error('Coach unavailable');
      }

      const payload = await res.json().catch(() => ({}));
      const assistantText =
        payload?.data?.assistant || 'I am here—let me know what part feels unclear.';
      const assistantMessage: CoachMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: assistantText
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Mini coach send error', err);
      setError('Coach is temporarily unavailable. Try again.');
    } finally {
      setPending(false);
    }
  };

  return {
    userReady: Boolean(userId),
    messages,
    input,
    setInput,
    sendMessage,
    pending,
    error,
    clearError: () => setError(null)
  };
}
