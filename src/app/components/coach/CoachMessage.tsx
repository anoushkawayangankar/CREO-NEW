'use client';

import type { CoachMessage } from './useCoachSession';

type CoachMessageProps = {
  message: CoachMessage;
};

export default function CoachMessage({ message }: CoachMessageProps) {
  const isCoach = message.role === 'assistant';
  return (
    <div className={`flex ${isCoach ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
          isCoach
            ? 'bg-white text-[#2f1f1a] border border-[#f0e2db]'
            : 'bg-[#1f120f] text-white border border-[#2c1a15]'
        }`}
      >
        <p className="text-[0.65rem] uppercase tracking-[0.25em] text-[#c24f63]">
          {isCoach ? 'Coach' : 'You'}
        </p>
        <p className="mt-1 whitespace-pre-wrap leading-snug">{message.content}</p>
      </div>
    </div>
  );
}
