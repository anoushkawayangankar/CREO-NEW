'use client';

import { useMemo } from 'react';
import { Sparkles, X } from 'lucide-react';
import CoachInput from './CoachInput';
import CoachMessage from './CoachMessage';
import { MINI_COACH_GREETING, ModuleCoachContext, useCoachSession } from './useCoachSession';
import { CourseModule } from '@/app/types/course';

type MiniCoachChatProps = {
  open: boolean;
  module?: CourseModule | null;
  courseTitle?: string;
  courseDifficulty?: string;
  userProgress?: string;
  lastQuizResult?: string;
  onClose: () => void;
};

export default function MiniCoachChat({
  open,
  module,
  courseTitle,
  courseDifficulty,
  userProgress,
  lastQuizResult,
  onClose
}: MiniCoachChatProps) {
  const topics = useMemo(
    () => module?.topics?.map((topic) => topic.title).filter(Boolean) ?? [],
    [module]
  );

  const context: ModuleCoachContext | null = useMemo(() => {
    if (!module) return null;
    return {
      course: courseTitle || 'Course',
      difficulty: courseDifficulty || 'intermediate',
      currentModule: module.title,
      currentTopics: topics.slice(0, 8),
      userProgress: userProgress || 'Exploring this module plan',
      lastQuizResult: lastQuizResult || 'Not attempted yet'
    };
  }, [courseDifficulty, courseTitle, lastQuizResult, module, topics, userProgress]);

  const { messages, input, setInput, sendMessage, pending, userReady, error, clearError } =
    useCoachSession({
      moduleId: module?.id,
      open,
      context
    });

  if (!module) return null;

  const subtitle = context
    ? `${context.course} · ${context.difficulty}`
    : `${courseTitle || 'Course'} · ${courseDifficulty || 'intermediate'}`;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[80] transition-all duration-300 ${
        open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-hidden={!open}
      style={{
        width: '32vw',
        maxWidth: 480,
        minWidth: 320,
        height: '48vh',
        maxHeight: 540
      }}
    >
      <div className="flex h-full flex-col rounded-3xl border border-[#f0e2db] bg-[#fffaf6] shadow-[0_20px_70px_rgba(26,13,9,0.2)]">
        <div className="flex items-start justify-between gap-3 border-b border-[#f2e7d9] px-4 py-3">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#c24f63]">Module coach</p>
            <h3 className="text-base font-semibold text-[#1f120f]">{module.title}</h3>
            <p className="text-xs text-[#7a5a54]">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close coach"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#f0e2db] text-[#7a5a54] transition hover:bg-[#fdf1ec]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="border-b border-[#f2e7d9] bg-[#fef7f3] px-4 py-2 text-xs text-[#7a5a54]">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#c24f63]" />
            <span>
              Scoped to this module{topics.length ? `: ${topics.slice(0, 3).join(', ')}` : ''}
            </span>
          </div>
          <p className="mt-1 text-[0.75rem] text-[#9b7a71]">
            Context is preloaded; no need to repeat details.
          </p>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
          {messages.map((message) => (
            <CoachMessage key={message.id} message={message} />
          ))}
          {!messages.length && (
            <div className="text-center text-xs text-[#9b7a71]">
              {userReady ? MINI_COACH_GREETING : 'Preparing your coach...'}
            </div>
          )}
        </div>

        {error && (
          <div className="mx-4 mb-2 rounded-xl bg-[#fff1ef] px-3 py-2 text-xs font-semibold text-[#c24f63]">
            {error}
            <button
              type="button"
              onClick={clearError}
              className="ml-2 text-[0.7rem] underline decoration-dotted"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="px-4 pb-3">
          <CoachInput
            value={input}
            onChange={setInput}
            onSend={() => sendMessage()}
            pending={pending}
            disabled={!userReady}
          />
          <p className="mt-1 text-[0.7rem] text-[#9b7a71]">
            Stays scoped to this module—ask follow-ups or request a different explanation.
          </p>
        </div>
      </div>
    </div>
  );
}
