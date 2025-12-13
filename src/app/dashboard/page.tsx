'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { Inter } from 'next/font/google';
import { 
  LogOut, 
  BookOpen, 
  GraduationCap, 
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter'
});

type StreakData = {
  current: number;
  longest: number;
  lastActive: string;
  activeToday: boolean;
};

type XpData = {
  level: number;
  currentXp: number;
  nextLevelXp: number;
  weeklyXp: number;
};

type DailyGoalData = {
  goal: number;
  progress: number;
};

type SkillSnapshot = {
  name: string;
  progress: number;
  status: 'Learning' | 'Mastered' | 'Locked';
};

type LeagueData = {
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  position: number;
  peers: number;
  weeklyXp: number;
};

type GamificationPayload = {
  streak: StreakData;
  xp: XpData;
  dailyGoal: DailyGoalData;
  skills: SkillSnapshot[];
  league: LeagueData;
};

const fetchGamificationSnapshot = async (): Promise<GamificationPayload> => {
  // Placeholder for a real API/DB call; keeps JSX free of hardcoded literals.
  const today = new Date();
  const lastActive = new Date(today);
  lastActive.setDate(today.getDate() - 0);

  return Promise.resolve({
    streak: {
      current: 7,
      longest: 15,
      lastActive: lastActive.toISOString(),
      activeToday: true
    },
    xp: {
      level: 5,
      currentXp: 1420,
      nextLevelXp: 1800,
      weeklyXp: 380
    },
    dailyGoal: {
      goal: 30,
      progress: 18
    },
    skills: [
      { name: 'React Patterns', progress: 72, status: 'Learning' },
      { name: 'TypeScript', progress: 64, status: 'Learning' },
      { name: 'System Design', progress: 28, status: 'Learning' },
      { name: 'AI Tutoring', progress: 54, status: 'Learning' }
    ],
    league: {
      tier: 'Bronze',
      position: 12,
      peers: 50,
      weeklyXp: 380
    }
  });
};

export default function DashboardPage() {
  const { user, isLoading, logout, verifyToken } = useAuth();
  const router = useRouter();
  const [gamification, setGamification] = useState<GamificationPayload | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      verifyToken();
      fetchGamificationSnapshot().then(setGamification);
    }
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  // Get user initials for avatar
  const getInitials = (email: string) => {
    const name = email.split('@')[0];
    return name.substring(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#ffb9c5] border-t-transparent mx-auto"></div>
          <p className="mt-4 text-[#6b5d52] font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const memberDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const lastActiveDate = gamification ? new Date(gamification.streak.lastActive) : null;
  const streakAtRisk =
    gamification && !gamification.streak.activeToday
      ? 'Streak at risk — check in today to keep the flame alive.'
      : 'Keep the flame going — one session today locks your streak.';

  const dailyProgressPct = gamification
    ? Math.min(100, Math.round((gamification.dailyGoal.progress / gamification.dailyGoal.goal) * 100))
    : 0;

  const xpProgressPct = gamification
    ? Math.min(
        100,
        Math.round(
          ((gamification.xp.currentXp - (gamification.xp.level - 1) * 300) /
            (gamification.xp.nextLevelXp - (gamification.xp.level - 1) * 300)) *
            100
        )
      )
    : 0;

  return (
    <div className={`${inter.variable} min-h-screen bg-gradient-to-br from-[#faf8f5] via-[#fef9f6] to-[#fff5f0]`}>
      {/* Navigation */}
      <nav className="px-6 py-5 border-b border-[#ede8e3]/50 bg-white/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#ff9bb5] via-[#ffb9c5] to-[#ffd6a5] text-white text-base font-bold shadow-sm group-hover:shadow-md transition-shadow">
              ∞
            </div>
            <span className="font-bold text-lg text-[#2d1f1a] tracking-tight">CREO</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-[#6b5d52] hover:text-[#2d1f1a] transition-colors"
            >
              Home
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#6b5d52] hover:text-[#2d1f1a] transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Profile Card */}
        <div className="bg-white rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-[#f0ebe6] p-8 sm:p-10 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Profile Photo with Gradient Ring */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ff9bb5] via-[#ffb9c5] to-[#ffd6a5] p-[3px] animate-pulse-slow">
                <div className="w-full h-full rounded-full bg-white"></div>
              </div>
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#ff9bb5] via-[#ffb9c5] to-[#ffd6a5] flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                {getInitials(user.email)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                <CheckCircle2 className="h-4 w-4 text-[#10b981]" fill="currentColor" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#2d1f1a] mb-2 tracking-tight">
                Welcome back!
              </h1>
              <p className="text-lg text-[#6b5d52] mb-4 font-medium">
                {user.email}
              </p>
              
              {/* Status Badge */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#ff9bb5]/10 to-[#ffb9c5]/10 border border-[#ff9bb5]/20 text-sm font-medium text-[#c24f63]">
                  <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></div>
                  Active
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f5f3f0] text-sm font-medium text-[#6b5d52]">
                  <Calendar className="h-3.5 w-3.5" />
                  Member since {memberDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-[#2d1f1a] mb-6 px-2">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Course Builder Card */}
            <Link
              href="/course"
              className="group relative bg-white rounded-[24px] border border-[#f0ebe6] p-6 sm:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff9bb5] to-[#ffb9c5] flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <ArrowRight className="h-5 w-5 text-[#c4b5aa] group-hover:text-[#ff9bb5] group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-xl font-semibold text-[#2d1f1a] mb-2 group-hover:text-[#c24f63] transition-colors">
                Course Builder
              </h3>
              <p className="text-sm text-[#6b5d52] leading-relaxed">
                Create a new learning path tailored to your goals
              </p>
            </Link>

            {/* Learning Coach Card */}
            <Link
              href="/tutor"
              className="group relative bg-white rounded-[24px] border border-[#f0ebe6] p-6 sm:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ffb9c5] to-[#ffd6a5] flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <ArrowRight className="h-5 w-5 text-[#c4b5aa] group-hover:text-[#ff9bb5] group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-xl font-semibold text-[#2d1f1a] mb-2 group-hover:text-[#c24f63] transition-colors">
                Learning Coach
              </h3>
              <p className="text-sm text-[#6b5d52] leading-relaxed">
                Get personalized learning help and guidance
              </p>
            </Link>
          </div>
        </div>

        {/* Gamified Momentum */}
        {gamification && (
          <div className="space-y-6 mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Streak */}
              <div className="relative overflow-hidden rounded-[24px] border border-[#ffe0d6] bg-gradient-to-br from-[#fff3ed] via-[#ffe8e0] to-[#ffd6c5] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:-translate-y-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#c24f63] uppercase tracking-wide">Streak</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 shadow-sm">
                          <span className="animate-pulse text-2xl">🔥</span>
                        </div>
                        <div>
                          <div className="text-3xl font-black text-[#2d1f1a] leading-tight">{gamification.streak.current} days</div>
                          <p className="text-sm text-[#6b5d52]">
                            Longest {gamification.streak.longest} days
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-full px-3 py-1 bg-white/70 text-xs font-semibold text-[#c24f63] border border-[#ffb9c5]/40">
                    {gamification.streak.activeToday ? 'Active today' : 'Streak at risk'}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-[#6b5d52]">
                  <span>
                    Last active {lastActiveDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-2 text-[#c24f63] font-semibold">
                    Keep the flame {gamification.streak.activeToday ? 'growing' : 'alive'}
                    <Sparkles className="h-4 w-4" />
                  </span>
                </div>
                <p className="mt-2 text-sm text-[#6b5d52]">{streakAtRisk}</p>
              </div>

              {/* XP Progress */}
              <div className="rounded-[24px] border border-[#f0ebe6] bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#c24f63] uppercase tracking-wide">XP Journey</p>
                    <h3 className="text-3xl font-black text-[#2d1f1a] mt-1">Level {gamification.xp.level}</h3>
                    <p className="text-sm text-[#6b5d52] mt-1">
                      {gamification.xp.nextLevelXp - gamification.xp.currentXp} XP to level up
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase text-[#9b8c82] font-semibold">Weekly XP</p>
                    <p className="text-xl font-bold text-[#c24f63]">{gamification.xp.weeklyXp}</p>
                  </div>
                </div>
                <div className="mt-5 h-3 rounded-full bg-[#f5f3f0] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#c24f63] via-[#ff9bb5] to-[#ffd6a5] transition-all duration-700"
                    style={{ width: `${xpProgressPct}%` }}
                  />
                </div>
                <div className="mt-3 flex justify-between text-sm text-[#6b5d52]">
                  <span>{gamification.xp.currentXp} XP</span>
                  <span>{gamification.xp.nextLevelXp} XP</span>
                </div>
              </div>

              {/* League */}
              <div className="rounded-[24px] border border-[#f0ebe6] bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#c24f63] uppercase tracking-wide">League</p>
                    <h3 className="text-2xl font-black text-[#2d1f1a] mt-1">{gamification.league.tier} League</h3>
                    <p className="text-sm text-[#6b5d52] mt-1">#{gamification.league.position} of {gamification.league.peers}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ffd6a5] to-[#ffb9c5] text-white text-xl font-black shadow-md">
                    ★
                  </div>
                </div>
                <div className="mt-4 rounded-2xl bg-gradient-to-r from-[#fff5f0] to-[#fff0eb] border border-[#ffe0d6] px-4 py-3">
                  <p className="text-sm font-semibold text-[#c24f63]">Weekly push</p>
                  <p className="text-sm text-[#6b5d52] mt-1">
                    {gamification.league.weeklyXp} XP this week — keep climbing to stay in the league.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Daily Goal */}
              <div className="rounded-[24px] border border-[#ffe0d6] bg-gradient-to-br from-[#fff3ed] via-[#ffe8e0] to-[#ffd6c5] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#c24f63] uppercase tracking-wide">Today</p>
                    <h3 className="text-2xl font-black text-[#2d1f1a] mt-1">Daily goal</h3>
                    <p className="text-sm text-[#6b5d52] mt-1">
                      {gamification.dailyGoal.progress} / {gamification.dailyGoal.goal} XP
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-[#c24f63] text-lg font-black shadow-md">
                    ⚡
                  </div>
                </div>
                <div className="mt-4 h-3 rounded-full bg-white/60 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#c24f63] via-[#ff9bb5] to-[#ffd6a5] transition-all duration-700"
                    style={{ width: `${dailyProgressPct}%` }}
                  />
                </div>
                <p className="mt-3 text-sm font-semibold text-[#c24f63]">
                  {dailyProgressPct >= 80 ? 'Almost there — one lesson to go!' : 'Quick win: grab a 10 XP bite-sized task.'}
                </p>
              </div>

              {/* Skills */}
              <div className="lg:col-span-2 rounded-[24px] border border-[#f0ebe6] bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-[#c24f63] uppercase tracking-wide">Skills</p>
                    <h3 className="text-xl font-black text-[#2d1f1a] mt-1">Momentum snapshot</h3>
                  </div>
                  <span className="text-xs font-semibold text-[#9b8c82]">
                    Focused set to avoid overwhelm
                  </span>
                </div>
                <div className="space-y-3">
                  {gamification.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="rounded-xl border border-[#f5f3f0] px-4 py-3 hover:border-[#ffb9c5]/60 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-[#2d1f1a]">{skill.name}</div>
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            skill.status === 'Mastered'
                              ? 'bg-[#e8f7f0] text-[#0f9d58]'
                              : skill.status === 'Locked'
                              ? 'bg-[#f5f3f0] text-[#9b8c82]'
                              : 'bg-[#fff0f5] text-[#c24f63]'
                          }`}
                        >
                          {skill.status}
                        </span>
                      </div>
                      <div className="mt-2 h-2.5 rounded-full bg-[#f5f3f0] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#c24f63] via-[#ff9bb5] to-[#ffd6a5] transition-all duration-700"
                          style={{ width: `${skill.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Info Card */}
        <div className="bg-gradient-to-br from-[#fff5f0] to-[#fff0eb] rounded-[24px] border border-[#ffe8e0] p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff9bb5] to-[#ffb9c5] flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#2d1f1a] mb-2">
                Ready to learn?
              </h3>
              <p className="text-sm text-[#6b5d52] leading-relaxed">
                Start building your personalized learning journey or connect with your learning coach to get started.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
