'use client';

import Link from 'next/link';
import { Playfair_Display, Space_Grotesk } from 'next/font/google';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Sparkles, Star } from 'lucide-react';
import Waves from '@/app/components/Waves';

const headlineFont = Playfair_Display({ subsets: ['latin'], weight: ['600', '700', '900'] });
const bodyFont = Space_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600'] });

export default function Home() {
  return (
    <div className={`${bodyFont.className} relative min-h-screen overflow-hidden bg-gradient-to-br from-[#a95757] via-[#c1b6a4] to-[#a95757]`}>
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#b87070]/80 via-[#d4c9b8]/70 to-[#b87070]/80"
        animate={{
          opacity: [0.7, 0.9, 0.7],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Soft waves overlay */}
      <Waves
        lineColor="rgba(255, 255, 255, 0.12)"
        backgroundColor="transparent"
        waveSpeedX={0.006}
        waveSpeedY={0.002}
        waveAmpX={25}
        waveAmpY={15}
        xGap={15}
        yGap={45}
        friction={0.96}
        tension={0.003}
        maxCursorMove={60}
        style={{ position: 'absolute', zIndex: 1, pointerEvents: 'none' }}
      />

      {/* Floating sparkles */}
      <motion.div
        className="absolute top-[15%] left-[10%] text-yellow-200"
        animate={{
          y: [-10, 10, -10],
          rotate: [0, 45, 0],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <Star className="w-8 h-8 fill-current" />
      </motion.div>

      <motion.div
        className="absolute top-[25%] right-[15%] text-yellow-200"
        animate={{
          y: [10, -10, 10],
          rotate: [45, 0, 45],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
      >
        <Sparkles className="w-6 h-6" />
      </motion.div>

      <motion.div
        className="absolute bottom-[30%] right-[20%] text-yellow-200"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
      >
        <Star className="w-5 h-5 fill-current" />
      </motion.div>

      <motion.div
        className="absolute bottom-[20%] left-[18%] text-yellow-200"
        animate={{
          y: [-8, 8, -8],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ duration: 4.5, repeat: Infinity, delay: 1.5 }}
      >
        <Sparkles className="w-7 h-7" />
      </motion.div>

      {/* Navigation */}
      <nav className="relative z-30 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-2xl font-bold text-white shadow-lg">
              ∞
            </div>
            <span className={`${headlineFont.className} text-2xl font-bold text-white drop-shadow-lg`}>
              LearnLoop
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/course"
              className="px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold text-sm hover:bg-white/30 transition-all"
            >
              Course Builder
            </Link>
            <Link
              href="/api-test"
              className="px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition-all"
            >
              API
            </Link>
          </div>
        </div>
      </nav>

      {/* Main hero content */}
      <div className="relative z-20 flex items-center justify-center min-h-[calc(100vh-100px)] px-6">
        <div className="max-w-7xl w-full">
          {/* Floating elements */}
          
          {/* Holographic course card - left */}
          <motion.div
            className="absolute left-[5%] top-[20%] hidden lg:block"
            animate={{
              y: [-15, 15, -15],
              rotate: [-3, 3, -3]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-72 h-44 rounded-3xl bg-gradient-to-br from-purple-400/30 via-pink-300/30 to-yellow-300/30 backdrop-blur-xl border border-white/40 shadow-2xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/10" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-white/30 backdrop-blur-sm flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">Active Course</span>
                </div>
                <h3 className={`${headlineFont.className} text-white text-xl mb-2`}>React Fundamentals</h3>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-gradient-to-r from-yellow-300 to-pink-300 h-2 rounded-full w-2/3" />
                  </div>
                  <span>67%</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mascot book character - right top */}
          <motion.div
            className="absolute right-[8%] top-[15%] hidden lg:block"
            animate={{
              y: [-20, 20, -20],
              rotate: [5, -5, 5]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-xl border-4 border-white/50 shadow-2xl flex items-center justify-center">
              <GraduationCap className="w-24 h-24 text-white drop-shadow-lg" />
            </div>
          </motion.div>

          {/* Progress card - left bottom */}
          <motion.div
            className="absolute left-[8%] bottom-[15%] hidden lg:block"
            animate={{
              y: [15, -15, 15],
              rotate: [-5, 5, -5]
            }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-2xl">🎯</span>
                </div>
                <div>
                  <p className="text-white/70 text-xs font-semibold uppercase tracking-wide">Your Progress</p>
                  <p className={`${headlineFont.className} text-white text-2xl font-bold`}>24 Modules</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Achievement badge - bottom center */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 bottom-[20%] hidden lg:block"
            animate={{
              y: [-10, 10, -10],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-20 h-24 rounded-2xl bg-gradient-to-br from-yellow-200/40 to-orange-300/40 backdrop-blur-xl border border-white/50 shadow-2xl flex items-center justify-center">
              <div className="text-4xl">🔒</div>
            </div>
          </motion.div>

          {/* Cloud decoration - right bottom */}
          <motion.div
            className="absolute right-[12%] bottom-[12%] hidden lg:block"
            animate={{
              x: [-10, 10, -10],
              y: [-5, 5, -5]
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="text-8xl opacity-60 filter drop-shadow-2xl">
              ☁️
            </div>
          </motion.div>

          {/* Stats indicator - top right */}
          <motion.div
            className="absolute right-[15%] top-[35%] hidden lg:block"
            animate={{
              scale: [1, 1.05, 1],
              y: [-5, 5, -5]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="rounded-2xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl px-5 py-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white text-sm font-semibold">Active</span>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-yellow-200 text-2xl font-bold">18,240</span>
                <span className="text-white/70 text-xs">learners</span>
              </div>
            </div>
          </motion.div>

          {/* Main headline */}
          <div className="text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className={`${headlineFont.className} text-6xl md:text-8xl lg:text-9xl font-black text-white mb-4 relative inline-block`}>
                <span className="relative z-10 drop-shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                  Meet
                  <br />
                  LearnLoop
                </span>
                <div className="absolute inset-0 bg-white/10 blur-3xl -z-10" />
              </h1>
            </motion.div>

            <motion.p
              className="text-white/90 text-xl md:text-2xl font-medium mt-6 mb-8 drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              This is Smart Learning
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link
                href="/course"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-400 text-gray-900 font-bold text-lg shadow-2xl hover:shadow-yellow-400/50 hover:scale-105 transition-all"
              >
                <span>Start Learning</span>
                <span className="text-xl">→</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
