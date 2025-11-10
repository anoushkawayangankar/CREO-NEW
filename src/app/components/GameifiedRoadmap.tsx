'use client';

import { motion } from 'framer-motion';
import { Course, CourseModule } from '@/app/types/course';
import { CheckCircle2, Star, Trophy, Zap } from 'lucide-react';
import { Space_Grotesk } from 'next/font/google';

const bodyFont = Space_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600'] });

interface GameifiedRoadmapProps {
  course: Course;
}

const GameifiedRoadmap = ({ course }: GameifiedRoadmapProps) => {
  const modules = course.modules || [];
  
  // Create winding Candy Crush-style path positions (percentages for responsive design)
  const getNodePosition = (index: number, total: number) => {
    const progress = index / Math.max(total - 1, 1);
    
    // Create a winding S-curve path from bottom to top
    const y = 85 - (progress * 70); // Bottom to top (85% to 15%)
    
    // Alternate left-right with smooth sine wave
    const amplitude = 25; // How far left/right the path swings
    const frequency = 1.5; // Number of curves
    const x = 50 + Math.sin(index * frequency) * amplitude;
    
    return { x, y };
  };

  // Generate SVG path through all nodes using percentages
  const generatePath = () => {
    if (modules.length === 0) return '';
    
    let path = '';
    modules.forEach((_, index) => {
      const pos = getNodePosition(index, modules.length);
      if (index === 0) {
        path += `M ${pos.x} ${pos.y}`;
      } else {
        const prevPos = getNodePosition(index - 1, modules.length);
        const midX = (prevPos.x + pos.x) / 2;
        const midY = (prevPos.y + pos.y) / 2;
        // Use quadratic curves for smooth winding path
        path += ` Q ${midX} ${midY}, ${pos.x} ${pos.y}`;
      }
    });
    return path;
  };

  const pathData = generatePath();
  const pathLength = modules.length * 50; // Estimated path length for animation

  return (
    <div className={`${bodyFont.className} w-full py-8`}>
      {/* Header */}
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#fff5ef] to-[#f2e7d9] rounded-full border border-[#a95757]/20 mb-2">
            <Trophy className="w-4 h-4 text-[#a95757]" />
            <span className="text-xs uppercase tracking-[0.2em] text-[#a95757] font-semibold">
              Your Learning Journey
            </span>
          </div>
          <h3 className="text-2xl font-bold text-[#262626] mb-1">{course.title}</h3>
          <p className="text-sm text-[#666]">{course.description}</p>
        </div>
        
        {/* Progress stats */}
        <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-full shadow-lg border border-[#f2e7d9]">
          <Star className="w-5 h-5 text-[#a95757] fill-[#a95757]" />
          <span className="text-lg font-bold text-[#262626]">{modules.length}</span>
          <span className="text-sm text-[#666]">modules</span>
        </div>
      </motion.div>

      {/* Candy Crush style map */}
      <div className="relative w-full bg-gradient-to-br from-[#fffcf9] to-[#fff5ef] rounded-3xl shadow-xl p-8 border border-[#f2e7d9]" style={{ minHeight: '500px', height: '70vh', maxHeight: '700px' }}>
        
        {/* SVG Path connecting all nodes */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#a95757" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#c1b6a4" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#a95757" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          
          <motion.path
            d={pathData}
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="0.8"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: 'easeInOut', delay: 0.3 }}
          />
        </svg>

        {/* Module nodes positioned along the path */}
        {modules.map((module, index) => {
          const position = getNodePosition(index, modules.length);
          const gradientColors = [
            'bg-gradient-to-br from-[#ff9a8b] to-[#a95757]',
            'bg-gradient-to-br from-[#ffd89b] to-[#c1b6a4]',
            'bg-gradient-to-br from-[#a18cd1] to-[#a95757]'
          ];
          const bgGradient = gradientColors[index % gradientColors.length];
          
          return (
            <motion.div
              key={module.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${position.x}%`, top: `${position.y}%` }}
              initial={false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.5 + index * 0.15,
                type: 'spring',
                stiffness: 260,
                damping: 20
              }}
            >
              {/* Glow effect for first module (current) */}
              {index === 0 && (
                <div className="absolute inset-0 w-20 h-20 -m-4 bg-[#a95757] rounded-full blur-xl opacity-30 animate-pulse" />
              )}

              {/* Circle node */}
              <motion.button
                whileHover={{ scale: 1.25 }}
                whileTap={{ scale: 0.95 }}
                className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl cursor-pointer transition-all duration-300 ${bgGradient} border-4 border-white`}
                aria-label={`Module ${index + 1}: ${module.title}`}
              >
                <span className="text-2xl font-bold text-white drop-shadow-md">
                  {index + 1}
                </span>

                {/* Completion checkmark */}
                <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-md">
                  <CheckCircle2 className="w-5 h-5 text-[#34d399] fill-[#34d399]" />
                </div>
              </motion.button>

              {/* Achievement icon overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {index === 0 && <Star className="w-7 h-7 text-white drop-shadow-lg" fill="white" />}
                {index === modules.length - 1 && <Trophy className="w-7 h-7 text-white drop-shadow-lg" />}
                {index > 0 && index < modules.length - 1 && <Zap className="w-7 h-7 text-white drop-shadow-lg" />}
              </div>

              {/* Topic count stars below */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                {[1, 2, 3].map((i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i <= Math.min(module.topics?.length || 0, 3)
                        ? 'text-[#a95757] fill-[#a95757]'
                        : 'text-[#e5e7eb]'
                    }`}
                  />
                ))}
              </div>

              {/* Tooltip on hover */}
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                <div className="bg-[#262626] text-white text-sm px-4 py-2 rounded-xl shadow-2xl border border-[#a95757]/20">
                  <div className="font-semibold mb-1">{module.title}</div>
                  <div className="text-xs text-[#c1b6a4]">{module.topics?.length || 0} topics</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Progress stats cards */}
      <div className="hidden relative w-full overflow-x-auto">
        <svg 
          width="600" 
          height={200 + modules.length * 180}
          className="mx-auto"
          style={{ minHeight: '400px' }}
        >
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a95757" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#c1b6a4" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#a95757" stopOpacity="0.3" />
            </linearGradient>
            
            <linearGradient id="nodeGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff9a8b" />
              <stop offset="100%" stopColor="#a95757" />
            </linearGradient>
            
            <linearGradient id="nodeGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffd89b" />
              <stop offset="100%" stopColor="#c1b6a4" />
            </linearGradient>
            
            <linearGradient id="nodeGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a18cd1" />
              <stop offset="100%" stopColor="#a95757" />
            </linearGradient>
            
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* Module nodes positioned absolutely */}
        <div className="relative" style={{ marginTop: `-${200 + modules.length * 180}px`, height: `${200 + modules.length * 180}px` }}>
          {modules.map((module, index) => {
            const pos = getNodePosition(index, modules.length);
            const gradientColors = [
              'linear-gradient(135deg, #ff9a8b 0%, #a95757 100%)',
              'linear-gradient(135deg, #ffd89b 0%, #c1b6a4 100%)',
              'linear-gradient(135deg, #a18cd1 0%, #a95757 100%)'
            ];
            const gradient = gradientColors[index % gradientColors.length];
            
            return (
              <motion.div
                key={index}
                className="absolute"
                style={{
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  transform: 'translate(-50%, -50%)'
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.5 + index * 0.2,
                  type: 'spring',
                  stiffness: 200,
                  damping: 15
                }}
              >
                <motion.button
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  whileFocus={{ scale: 1.1 }}
                  className="relative group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#a95757] focus:ring-offset-2 rounded-full"
                  aria-label={`Module ${index + 1}: ${module.title} - ${module.topics?.length || 0} topics`}
                  tabIndex={0}
                >
                  {/* Glow effect */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#a95757]/20 to-[#c1b6a4]/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition duration-300" />
                  
                  {/* Node circle */}
                  <div 
                    className="relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4 border-white"
                    style={{
                      background: gradient
                    }}
                  >
                    <div className="relative z-10 text-white">
                      {index === 0 && <Star className="w-6 h-6" fill="currentColor" aria-hidden="true" />}
                      {index === modules.length - 1 && <Trophy className="w-6 h-6" aria-hidden="true" />}
                      {index > 0 && index < modules.length - 1 && <Zap className="w-6 h-6" aria-hidden="true" />}
                    </div>
                    
                    {/* Module number badge */}
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-[#a95757] shadow-md border-2 border-[#a95757]" aria-hidden="true">
                      {index + 1}
                    </div>
                  </div>

                  {/* Module info card */}
                  <div
                    className="absolute left-20 top-0 w-64 bg-white rounded-xl shadow-xl border border-[#f2e7d9] p-4 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity z-20"
                    role="tooltip"
                  >
                    <h4 className="font-semibold text-sm text-[#262626] mb-1">{module.title}</h4>
                    <p className="text-xs text-[#666] mb-3 line-clamp-2">{module.description}</p>
                    <div className="flex items-center gap-2 text-xs text-[#a95757]">
                      <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                      <span>{module.topics?.length || 0} topics</span>
                    </div>
                  </div>
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Progress stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="mt-12 flex justify-center gap-6"
      >
        <div className="px-6 py-3 bg-gradient-to-br from-[#fff5ef] to-white rounded-xl border border-[#f2e7d9] shadow-sm">
          <div className="text-2xl font-bold text-[#a95757]">{modules.length}</div>
          <div className="text-xs text-[#c1b6a4] uppercase tracking-wider">Modules</div>
        </div>
        <div className="px-6 py-3 bg-gradient-to-br from-[#fff5ef] to-white rounded-xl border border-[#f2e7d9] shadow-sm">
          <div className="text-2xl font-bold text-[#a95757]">
            {modules.reduce((acc, m) => acc + (m.topics?.length || 0), 0)}
          </div>
          <div className="text-xs text-[#c1b6a4] uppercase tracking-wider">Topics</div>
        </div>
        <div className="px-6 py-3 bg-gradient-to-br from-[#fff5ef] to-white rounded-xl border border-[#f2e7d9] shadow-sm">
          <div className="text-2xl font-bold text-[#a95757]">{course.difficulty}</div>
          <div className="text-xs text-[#c1b6a4] uppercase tracking-wider">Level</div>
        </div>
      </motion.div>
    </div>
  );
};

export default GameifiedRoadmap;
