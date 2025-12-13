'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Sparkles, Send } from 'lucide-react';

type Sender = 'coach' | 'user';

type ChatMessage = {
  id: number;
  sender: Sender;
  text: string;
};

type LandingChatProps = {
  isDarkMode?: boolean;
};

const seedMessages: ChatMessage[] = [
  {
    id: 1,
    sender: 'coach',
    text: 'Hi! Tell me where you\'re stuck and how you like to learn.'
  },
  {
    id: 2,
    sender: 'user',
    text: 'Loops in JavaScript feel messy. I keep mixing for/of and forEach.'
  },
  {
    id: 3,
    sender: 'coach',
    text: 'Got it. Want a quick hint or a slower, step-by-step example?'
  }
];

const quickPrompts = [
  'Give me a hint',
  'Explain slower',
  'What should I practice next?'
];

export default function LandingChat({ isDarkMode = false }: LandingChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(seedMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const sendMessage = (text: string, sender: Sender) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length ? prev[prev.length - 1].id + 1 : 1,
        sender,
        text: trimmed
      }
    ]);
  };

  const handleSend = (value: string = input) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    sendMessage(trimmed, 'user');
    setInput('');
    setIsTyping(true);

    typingTimeoutRef.current = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length ? prev[prev.length - 1].id + 1 : 1,
          sender: 'coach',
          text: 'Here\'s a slower take: write a for..of loop, narrate each line, then swap to forEach and compare.'
        }
      ]);
      setIsTyping(false);
    }, 700);
  };

  const themeClasses = useMemo(
    () =>
      isDarkMode
        ? {
            panel: 'border-[#3a2f2a] bg-[#1f1410]/80 text-[#f5e6dc]',
            bubbleCoach: 'bg-[#2a1f1a] border-[#3a2f2a] text-[#f5e6dc]',
            bubbleUser: 'bg-gradient-to-r from-[#c24f63] to-[#ff9aa2] text-white',
            muted: 'text-[#c9a89a]'
          }
        : {
            panel: 'border-[#f2e1d8] bg-white/90 text-[#1f120f]',
            bubbleCoach: 'bg-[#fff4ec] border-[#f2e1d8] text-[#5b4743]',
            bubbleUser: 'bg-gradient-to-r from-[#1f120f] to-[#5b2c2b] text-white',
            muted: 'text-[#5b4743]/70'
          },
    [isDarkMode]
  );

  return (
    <div
      className={`relative flex h-full min-h-[320px] flex-col rounded-[28px] border p-5 shadow-[0_25px_60px_rgba(37,23,19,0.15)] backdrop-blur-xl transition-colors duration-300 ${themeClasses.panel}`}
    >
      <div className="flex items-center justify-between gap-3 pb-3">
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.4em] text-[#c24f63]">Inline coach</p>
          <h4 className="text-lg font-semibold">Ask, get a hint, keep momentum</h4>
          <p className={`text-xs ${themeClasses.muted}`}>
            The coach responds with calmer pacing when it senses frustration.
          </p>
        </div>
        <div className="hidden rounded-full bg-gradient-to-r from-[#c24f63] to-[#ff9aa2] p-2 text-white shadow-lg sm:block">
          <Sparkles className="h-4 w-4" />
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {messages.map((message) => {
          const bubbleClass =
            message.sender === 'coach'
              ? `max-w-[92%] ${themeClasses.bubbleCoach}`
              : `ml-auto max-w-[92%] ${themeClasses.bubbleUser}`;
          return (
            <div
              key={message.id}
              className={`w-fit rounded-2xl border px-4 py-3 text-sm shadow-sm ${bubbleClass}`}
            >
              <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[#c24f63]">
                {message.sender === 'coach' ? 'Coach' : 'You'}
              </p>
              <p className="mt-1 leading-relaxed">{message.text}</p>
            </div>
          );
        })}
        {isTyping && (
          <div className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs ${themeClasses.bubbleCoach}`}>
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#c24f63]" />
            <span className={themeClasses.muted}>Coach is typing…</span>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a blocker or ask for a hint…"
            className={`w-full rounded-full border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-[#c24f63]/30 ${
              isDarkMode
                ? 'border-[#3a2f2a] bg-[#2a1f1a] placeholder:text-[#7d6b5f] text-[#f5e6dc]'
                : 'border-[#f2e1d8] bg-white placeholder:text-[#b37871]/70 text-[#1f120f]'
            }`}
          />
          <button
            type="button"
            onClick={() => handleSend()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#c24f63] to-[#ff9aa2] text-white shadow-lg transition hover:-translate-y-[1px]"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSend(prompt)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                isDarkMode
                  ? 'border-[#3a2f2a] text-[#f5e6dc] hover:bg-[#2a1f1a]'
                  : 'border-[#f2e1d8] text-[#1f120f] hover:bg-[#fff4ec]'
              }`}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
