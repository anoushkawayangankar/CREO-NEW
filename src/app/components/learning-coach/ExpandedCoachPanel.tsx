'use client';

import { FormEvent, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Lightbulb, Loader2, Sparkles, Turtle, X } from 'lucide-react';
import { CoachMessage, CoachProfile, TopicProgress } from './types';

type Props = {
  open: boolean;
  onClose: () => void;
  messages: CoachMessage[];
  input: string;
  topic: string;
  onInputChange: (value: string) => void;
  onTopicChange: (value: string) => void;
  onSend: () => void;
  pending: boolean;
  learningMode: boolean;
  profile?: CoachProfile | null;
  progress?: TopicProgress[];
  signalNote?: string;
};

export default function ExpandedCoachPanel({
  open,
  onClose,
  messages,
  input,
  topic,
  onInputChange,
  onTopicChange,
  onSend,
  pending,
  learningMode,
  profile,
  progress,
  signalNote
}: Props) {
  const [showDetails, setShowDetails] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSend();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-end md:items-stretch"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 220, damping: 26 }}
            className="relative h-[70vh] w-full max-w-xl rounded-t-3xl border border-rose-100 bg-white shadow-2xl shadow-rose-100/60 md:h-full md:rounded-none md:rounded-l-3xl"
          >
            <div className="flex items-center justify-between border-b border-rose-100/70 px-4 py-3">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#1f120f]">
                <Sparkles className="h-4 w-4 text-amber-600" />
                Deep Focus Coach
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
                className="rounded-full p-2 text-[#5b4743] transition hover:bg-rose-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
                aria-label="Close coach"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex h-full flex-col gap-3 px-4 py-3">
              <div className="flex items-center justify-between text-xs text-[#5b4743]">
                <span>{signalNote ? `Watching: ${signalNote}` : 'Focused conversation'}</span>
                <button
                  type="button"
                  onClick={() => setShowDetails((prev) => !prev)}
                  className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 font-semibold text-[#5b4743]"
                >
                  {showDetails ? 'Hide details' : 'Learner details'}
                  <ArrowRight className={`h-3 w-3 transition ${showDetails ? 'rotate-90' : ''}`} />
                </button>
              </div>

              {showDetails && (
                <div className="grid gap-3 rounded-2xl border border-rose-100 bg-rose-50/50 p-3 text-xs text-[#5b4743]">
                  <div className="flex flex-wrap items-center gap-2">
                    <strong className="text-[#1f120f]">{profile?.name ?? 'Learner'}</strong>
                    {profile?.goals && <span className="rounded-full bg-white px-2 py-1">Goal: {profile.goals}</span>}
                    {profile?.learningStyle && (
                      <span className="rounded-full bg-white px-2 py-1">Style: {profile.learningStyle}</span>
                    )}
                    {profile?.attentionSpan && (
                      <span className="rounded-full bg-white px-2 py-1">Pacing: {profile.attentionSpan}</span>
                    )}
                  </div>
                  {progress && progress.length > 0 && (
                    <div className="grid gap-2">
                      {progress.slice(0, 3).map((item) => (
                        <div key={item.topic} className="grid gap-1 rounded-xl bg-white px-3 py-2">
                          <div className="flex items-center justify-between text-xs font-semibold text-[#1f120f]">
                            <span>{item.topic}</span>
                            <span className="text-emerald-700">{Math.round(item.confidence * 100)}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-rose-100">
                            <div
                              className={`h-full rounded-full ${
                                item.lastStatus === 'struggling'
                                  ? 'bg-amber-400'
                                  : item.lastStatus === 'improving'
                                  ? 'bg-emerald-500'
                                  : 'bg-emerald-400'
                              }`}
                              style={{ width: `${Math.max(10, Math.round(item.confidence * 100))}%` }}
                            />
                          </div>
                          <span className="text-[0.7rem] uppercase tracking-wide text-[#80665f]">
                            {item.lastStatus}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex-1 space-y-2 overflow-y-auto rounded-2xl border border-rose-50 bg-rose-50/50 p-3">
                {messages.length === 0 && (
                  <p className="text-sm text-[#80665f]">
                    Let&apos;s slow down for a second. What part feels unclear? I&apos;ll guide you step by step.
                  </p>
                )}
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-br from-[#1f120f] to-[#40221c] text-white'
                          : 'bg-white text-[#1f120f] shadow-sm'
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
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs text-rose-800">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Thinking...
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-2">
                <label className="sr-only" htmlFor="coach-topic">
                  Topic
                </label>
                <input
                  id="coach-topic"
                  value={topic}
                  onChange={(e) => onTopicChange(e.target.value)}
                  placeholder="Topic (optional, e.g., prefix sums, SQL joins)"
                  className="w-full rounded-2xl border border-rose-100 bg-white px-3 py-2 text-sm text-[#1f120f] focus:border-rose-300 focus:outline-none"
                />
                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={(e) => onInputChange(e.target.value)}
                    placeholder="Share what feels unclear or ask for a checkpoint..."
                    className="flex-1 rounded-2xl border border-rose-100 bg-white px-3 py-2 text-sm text-[#1f120f] focus:border-rose-300 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={pending || !input.trim()}
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#1f120f] to-[#40221c] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-rose-200/50 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lightbulb className="h-4 w-4" />}
                    Send
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
