'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Flame, HeartPulse, Sparkles, Trophy, Zap } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

type QuestProgress = {
  questId: string;
  progress: number;
  completedAt: string | null;
  claimed: boolean;
};

type Quest = {
  id: string;
  title: string;
  description?: string;
  type: 'daily' | 'weekly';
  metric: 'attempts' | 'xp';
  target: number;
  rewardXp: number;
  progress: QuestProgress;
};

type Skill = {
  id: string;
  title: string;
  difficulty: string;
  icon?: string | null;
  locked: boolean;
  completion: number;
};

type Stats = {
  xp: number;
  level: number;
  streakCount: number;
  hearts: number;
  maxHearts: number;
};

type GameState = {
  userId: string;
  stats: Stats;
  quests: Quest[];
  skills: Skill[];
};

const gradientCard = 'rounded-[28px] border shadow-[0_25px_60px_rgba(37,23,19,0.15)]';

const xpProgressPercent = (xp: number, level: number) => {
  const xpForLevel = (lvl: number) => (lvl <= 1 ? 60 : Math.round(60 + 75 * Math.pow(1.12, lvl - 1)));
  const spent = Array.from({ length: Math.max(level - 1, 0) }).reduce((sum, _item, index) => {
    const lvl = index + 1;
    return sum + xpForLevel(lvl);
  }, 0);
  const currentLevelXp = xp - spent;
  const needed = xpForLevel(level);
  return Math.min(100, Math.max(0, Math.round((currentLevelXp / needed) * 100)));
};

const StatChip = ({
  label,
  value,
  icon,
  tone
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  tone?: 'warm' | 'cool';
}) => (
  <div
    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
      tone === 'cool'
        ? 'bg-gradient-to-r from-[#e5f2ff] to-[#f0e9ff] text-[#1b1f36]'
        : 'bg-gradient-to-r from-[#fff2e8] to-[#ffe0ed] text-[#3d1a18]'
    }`}
  >
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/70 shadow-sm">{icon}</span>
    <div className="flex flex-col leading-tight">
      <span className="text-[0.65rem] uppercase tracking-[0.35em] opacity-70">{label}</span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  </div>
);

const QuestPill = ({
  quest,
  onClaim,
  headingColor,
  mutedColor
}: {
  quest: Quest;
  onClaim: (questId: string) => Promise<void>;
  headingColor: string;
  mutedColor: string;
}) => {
  const pct = Math.min(100, Math.round((quest.progress.progress / quest.target) * 100));
  const isReady = quest.progress.completedAt && !quest.progress.claimed;
  return (
    <motion.div
      layout
      className={`${gradientCard} border-[#f2e1d8] bg-white/80 p-4 transition hover:-translate-y-[2px]`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-[0.35em] text-[#c24f63]">{quest.type}</span>
            <span className="rounded-full bg-[#fff3f5] px-2 py-0.5 text-[0.7rem] text-[#ff5f9e]">
              +{quest.rewardXp} XP
            </span>
          </div>
          <p className={`text-base font-semibold ${headingColor}`}>{quest.title}</p>
          {quest.description && <p className={`text-sm ${mutedColor}`}>{quest.description}</p>}
        </div>
        {isReady ? (
          <button
            type="button"
            onClick={() => onClaim(quest.id)}
            className="rounded-full bg-gradient-to-r from-[#c24f63] to-[#ff9aa2] px-3 py-1.5 text-xs font-semibold text-white shadow-md"
          >
            Claim
          </button>
        ) : (
          <span className={`text-xs font-semibold ${mutedColor}`}>
            {quest.progress.progress}/{quest.target} {quest.metric}
          </span>
        )}
      </div>
      <div className="mt-3 h-2 w-full rounded-full bg-[#ffe9f0]">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-[#c24f63] to-[#ff9aa2] transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </motion.div>
  );
};

const SkillRow = ({ skill, isDark }: { skill: Skill; isDark: boolean }) => {
  const pct = Math.round(skill.completion * 100);
  const shell = isDark
    ? 'border-[#3a2f2a] bg-[#1f1410] text-[#f5e6dc]'
    : 'border-[#f2e1d8] bg-white/90 text-[#1f120f]';
  const titleColor = isDark ? 'text-[#f5e6dc]' : 'text-[#1f120f]';
  const metaColor = isDark ? 'text-[#c9a89a]' : 'text-[#7d5c55]';
  return (
    <div
      className={`${gradientCard} flex items-center justify-between ${shell} px-4 py-3 text-sm`}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{skill.icon ?? '🌱'}</span>
        <div>
          <p className={`font-semibold ${titleColor}`}>{skill.title}</p>
          <p className={`text-xs uppercase tracking-[0.3em] ${metaColor}`}>
            {skill.locked ? 'Locked' : 'Unlocked'} · {skill.difficulty}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-2 w-24 rounded-full bg-[#ffe9f0]">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-[#c24f63] to-[#ff9aa2]"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={`text-xs font-semibold ${metaColor}`}>{pct}%</span>
      </div>
    </div>
  );
};

const GamifiedDashboard = ({ isDarkMode = false }: { isDarkMode?: boolean }) => {
  const [state, setState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const panelBorder = isDarkMode ? 'border-[#3a2f2a]' : 'border-[#f2e1d8]';
  const panelBg = isDarkMode
    ? 'bg-gradient-to-br from-[#1a120e] via-[#1f1410] to-[#1a0f0c]'
    : 'bg-gradient-to-br from-[#fff7f2] via-[#fff0f6] to-[#fff5f0]';
  const cardBg = isDarkMode ? 'bg-[#1f1410]/80 text-[#f5e6dc]' : 'bg-white/80 text-[#1f120f]';
  const headingColor = isDarkMode ? 'text-[#f5e6dc]' : 'text-[#1f120f]';
  const mutedColor = isDarkMode ? 'text-[#c9a89a]' : 'text-[#5b4743]';

  const fetchState = async (persistedId?: string | null) => {
    setLoading(true);
    try {
      const query = persistedId ? `?userId=${persistedId}` : '';
      const response = await fetch(`/api/game${query}`, { cache: 'no-store' });
      const payload = await response.json();
      if (payload?.success) {
        const userId = payload.data.profile.id as string;
        setState({
          userId,
          stats: payload.data.stats,
          quests: payload.data.quests,
          skills: payload.data.skills
        });
        localStorage.setItem('creoUserId', userId);
      }
    } catch (error) {
      console.error('Failed to fetch game state', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userId = typeof window !== 'undefined' ? localStorage.getItem('creoUserId') : null;
    fetchState(userId);
  }, []);

  const nextLesson = useMemo(() => {
    if (!state) return null;
    const unlocked = state.skills.find((skill) => !skill.locked);
    if (!unlocked) return null;
    // mirror seed lesson ids
    const lessonMap: Record<string, string> = {
      'skill-algo-foundations': 'lesson-loops',
      'skill-data-structures': 'lesson-arrays',
      'skill-systems': 'lesson-queues'
    };
    return lessonMap[unlocked.id];
  }, [state]);

  const triggerAttempt = async (correct: boolean) => {
    if (!state || !nextLesson) return;
    setActionMsg(correct ? 'Nice! +20 XP' : 'Oof, -1 heart — try again!');
    try {
      await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: state.userId,
          lessonId: nextLesson,
          stepKey: 'demo-step',
          correct
        })
      });
      fetchState(state.userId);
    } catch (error) {
      console.error('Failed to record attempt', error);
    } finally {
      setTimeout(() => setActionMsg(null), 1600);
    }
  };

  const claimQuest = async (questId: string) => {
    if (!state) return;
    await fetch('/api/quests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: state.userId, questId })
    });
    fetchState(state.userId);
  };

  if (!state) {
    return (
      <div className={`${gradientCard} ${panelBorder} ${cardBg} p-6 text-sm`}>
        {loading ? 'Loading your CREO cockpit…' : 'Priming your CREO cockpit…'}
      </div>
    );
  }

  const xpPct = xpProgressPercent(state.stats.xp, state.stats.level);

  return (
    <div className={`${gradientCard} ${panelBorder} ${panelBg} p-6`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[#c24f63]">Your loop</p>
          <h3 className={`text-2xl font-bold ${headingColor}`}>XP, streak, and hearts in one glance</h3>
          <p className={`text-sm ${mutedColor}`}>
            Earn XP, keep hearts alive, and claim quests. Every attempt nudges the coach.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatChip label="Streak" value={`${state.stats.streakCount}🔥`} icon={<Flame className="h-4 w-4" />} />
          <StatChip label="Level" value={`Lv ${state.stats.level}`} icon={<Trophy className="h-4 w-4" />} tone="cool" />
          <StatChip
            label="Hearts"
            value={`${state.stats.hearts}/${state.stats.maxHearts}`}
            icon={<HeartPulse className="h-4 w-4" />}
          />
        </div>
      </div>

      <div
        className={`mt-6 rounded-3xl border ${isDarkMode ? 'border-[#3a2f2a] bg-[#1f1410]' : 'border-[#ffe0ed] bg-white/70'} p-4 shadow-inner`}
      >
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 text-sm font-semibold ${headingColor}`}>
            <Sparkles className="h-4 w-4 text-[#c24f63]" />
            <span>XP Progress</span>
          </div>
          <span className={`text-xs font-semibold ${mutedColor}`}>{xpPct}% to next level</span>
        </div>
        <div className="mt-2 h-3 w-full rounded-full bg-[#ffe9f0]">
          <motion.div
            className="h-3 rounded-full bg-gradient-to-r from-[#c24f63] via-[#ff9aa2] to-[#ffc19c]"
            animate={{ width: `${xpPct}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 text-sm font-semibold ${headingColor}`}>
            <Zap className="h-4 w-4 text-[#ff9aa2]" />
            <span>Daily + Weekly Quests</span>
          </div>
          <span className={`text-xs ${mutedColor}`}>Tiny tasks → big momentum</span>
          </div>
          <AnimatePresence initial={false}>
            {state.quests.map((quest) => (
              <QuestPill
                key={quest.id}
                quest={quest}
                onClaim={claimQuest}
                headingColor={headingColor}
                mutedColor={mutedColor}
              />
            ))}
          </AnimatePresence>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 text-sm font-semibold ${headingColor}`}>
              <Sparkles className="h-4 w-4 text-[#c24f63]" />
              <span>Skill Tree Snapshot</span>
            </div>
            <span className={`text-xs ${mutedColor}`}>Unlocks follow your level</span>
          </div>
          {state.skills.map((skill) => (
            <SkillRow key={skill.id} skill={skill} isDark={isDarkMode} />
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => triggerAttempt(true)}
          className="rounded-full bg-gradient-to-r from-[#1f120f] to-[#5b2c2b] px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-[1px]"
        >
          Quick win (+20 XP)
        </button>
        <button
          type="button"
          onClick={() => triggerAttempt(false)}
          className={`rounded-full border ${panelBorder} bg-white px-4 py-2 text-sm font-semibold ${headingColor} transition hover:-translate-y-[1px]`}
        >
          Risk a heart (-1 on miss)
        </button>
        {actionMsg && <span className="text-sm font-semibold text-[#c24f63]">{actionMsg}</span>}
      </div>
    </div>
  );
};

export default GamifiedDashboard;
