'use client';

import { FormEvent } from 'react';
import { Lightbulb, Loader2, Turtle, X } from 'lucide-react';
import { CoachMessage } from './types';

type QuickKey = 'hint' | 'explain' | 'simplify' | 'overwhelmed';

type Props = {
  messages: CoachMessage[];
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onClose: () => void;
  onExpand: () => void;
  onQuick: (key: QuickKey) => void;
  pending: boolean;
  learningMode: boolean;
  signalNote?: string;
};

const quickActions: Array<{ key: QuickKey; label: string; text: string }> = [
  { key: 'hint', label: 'Give me a hint', text: 'Can I get a hint?' },
  { key: 'explain', label: 'Explain differently', text: 'Explain this differently.' },
  { key: 'simplify', label: 'Simplify', text: 'Can you simplify this?' },
  { key: 'overwhelmed', label: "I'm overwhelmed", text: "I'm overwhelmed. Slow down." }
];

export default function MiniCoachPopover({
  messages,
  input,
  onInputChange,
  onSend,
  onClose,
  onExpand,
  onQuick,
  pending,
  learningMode,
  signalNote
}: Props) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSend();
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 w-[320px] max-w-[92vw] rounded-3xl border border-rose-100/70 bg-white/90 p-4 shadow-2xl shadow-rose-100/50 backdrop-blur-xl">
      <div className="flex items-center justify-between text-sm font-semibold text-[#1f120f]">
        <div className="inline-flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-amber-600" />
          Quick help
          {learningMode && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[0.65rem] font-semibold text-amber-900">
              <Turtle className="h-3 w-3" />
              Learning Mode
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 text-[#5b4743] transition hover:bg-rose-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
          aria-label="Close coach"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {quickActions.map((action) => (
          <button
            key={action.key}
            type="button"
            onClick={() => onQuick(action.key)}
            className="rounded-full border border-rose-100 bg-white px-3 py-1 text-xs font-semibold text-[#5b4743] transition hover:border-rose-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
          >
            {action.label}
          </button>
        ))}
      </div>

      {signalNote && (
        <p className="mt-2 text-[0.7rem] text-[#80665f]">
          Watching: {signalNote}
        </p>
      )}

      <div className="mt-3 h-32 overflow-y-auto space-y-2">
        {messages.length === 0 && (
          <p className="text-xs text-[#80665f]">Tell me what feels unclear, and I&apos;ll keep it brief.</p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-[#1f120f] to-[#40221c] text-white'
                  : 'bg-white text-[#1f120f] border border-rose-100'
              }`}
            >
              {msg.learningMode && (
                <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[0.65rem] font-semibold text-amber-900">
                  <Turtle className="h-3 w-3" />
                  Slow mode
                </span>
              )}
              {msg.content}
            </div>
          </div>
        ))}
        {pending && (
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[0.7rem] text-rose-800">
            <Loader2 className="h-3 w-3 animate-spin" />
            Thinking...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-3 space-y-2">
        <label className="sr-only" htmlFor="mini-coach-input">
          Message the coach
        </label>
        <input
          id="mini-coach-input"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Where are you stuck?"
          className="w-full rounded-2xl border border-rose-100 bg-white px-3 py-2 text-sm text-[#1f120f] focus:border-rose-300 focus:outline-none"
        />
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onExpand}
            className="text-xs font-semibold text-[#5b4743] underline decoration-rose-200 underline-offset-4"
          >
            Open coach
          </button>
          <button
            type="submit"
            disabled={pending || !input.trim()}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#1f120f] to-[#40221c] px-4 py-2 text-xs font-semibold text-white shadow-md shadow-rose-200/40 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lightbulb className="h-4 w-4" />}
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
