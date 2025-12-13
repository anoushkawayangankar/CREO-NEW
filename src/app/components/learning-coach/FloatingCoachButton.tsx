'use client';

import { motion } from 'framer-motion';
import { Sparkles, Eye, MessageSquare } from 'lucide-react';
import { CoachStatus } from './types';

type Props = {
  status: CoachStatus;
  onOpen: () => void;
};

const statusColor: Record<CoachStatus, string> = {
  idle: 'from-[#1f120f] to-[#40221c]',
  watching: 'from-[#c24f63] to-[#e88a8a]',
  active: 'from-[#0f766e] to-[#14b8a6]'
};

export default function FloatingCoachButton({ status, onOpen }: Props) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Open learning coach"
      title="Stuck? I’m here."
      className="group fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full p-[1px] shadow-lg shadow-rose-200/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-300"
    >
      <div
        className={`relative h-full w-full rounded-full bg-gradient-to-br ${statusColor[status]} flex items-center justify-center`}
      >
        <motion.span
          className="absolute inset-0 rounded-full"
          initial={{ opacity: 0.25 }}
          animate={{ opacity: status === 'watching' ? [0.25, 0.5, 0.25] : 0.2, scale: status === 'active' ? [1, 1.04, 1] : 1 }}
          transition={{ repeat: Infinity, duration: status === 'watching' ? 3 : 2 }}
          style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25), transparent 60%)' }}
        />
        {status === 'idle' && <Sparkles className="h-6 w-6 text-white" />}
        {status === 'watching' && <Eye className="h-6 w-6 text-white" />}
        {status === 'active' && <MessageSquare className="h-6 w-6 text-white" />}
      </div>
      <span className="pointer-events-none absolute left-16 top-1/2 -translate-y-1/2 rounded-full bg-[#1f120f] px-3 py-1 text-xs font-semibold text-white opacity-0 shadow-lg transition group-hover:opacity-100">
        Stuck? I&apos;m here.
      </span>
    </button>
  );
}
