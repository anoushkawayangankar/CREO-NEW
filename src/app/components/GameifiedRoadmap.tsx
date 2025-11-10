'use client';

import { motion } from 'framer-motion';
import { Course, CourseModule } from '@/app/types/course';
import { CheckCircle2, Star, Trophy, Zap, Sparkles } from 'lucide-react';
import { Space_Grotesk } from 'next/font/google';

const bodyFont = Space_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600'] });

interface GameifiedRoadmapProps {
  course: Course;
}

const GameifiedRoadmap = ({ course }: GameifiedRoadmapProps) => {
  const modules = course.modules || [];
  
  // Create winding Candy Crush-style path with better spacing
  const getNodePosition = (index: number, total: number) => {
    const progress = index / Math.max(total - 1, 1);
    
    // Vertical progression from bottom to top with good spacing
    const y = 85 - (progress * 65); // Bottom (85%) to top (20%)
    
    // Smooth S-curve winding left-right
    const amplitude = 22;
    const frequency = 0.7;
    const x = 50 + Math.sin(index * frequency * Math.PI) * amplitude;
    
    return { x, y };
  };

  // Generate smooth Bezier curve path
  const generatePath = () => {
    if (modules.length === 0) return '';
    
    let path = '';
    modules.forEach((_, index) => {
      const pos = getNodePosition(index, modules.length);
      if (index === 0) {
        path += `M ${pos.x} ${pos.y}`;
      } else {
        const prevPos = getNodePosition(index - 1, modules.length);
        // Use smooth cubic Bezier for natural curves
        const controlOffset = Math.abs(pos.y - prevPos.y) * 0.5;
        const cp1x = prevPos.x;
        const cp1y = prevPos.y - controlOffset;
        const cp2x = pos.x;
        const cp2y = pos.y + controlOffset;
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pos.x} ${pos.y}`;
      }
    });
    return path;
  };

  const pathData = generatePath();

  return (
    <div className={`${bodyFont.className} w-full py-8`}>
      {/* Header */}
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#fff5ef] to-[#f2e7d9] rounded-full border border-[#a95757]/20 mb-2 shadow-sm">
            <Sparkles className="w-4 h-4 text-[#a95757]" />
            <span className="text-xs uppercase tracking-[0.2em] text-[#a95757] font-semibold">
              Your Learning Journey
            </span>
          </div>
          <h3 className="text-2xl font-bold text-[#262626] mb-1">{course.title}</h3>
          <p className="text-sm text-[#666]">{course.description}</p>
        </div>
        
        {/* Progress stats - glassmorphic */}
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-5 py-3 rounded-full shadow-xl border border-white">
          <Star className="w-5 h-5 text-[#a95757] fill-[#a95757]" />
          <span className="text-lg font-bold text-[#262626]">{modules.length}</span>
          <span className="text-sm text-[#666]">modules</span>
        </div>
      </motion.div>

      {/* Candy Crush/Byju's style game map */}
      <div 
        className="relative w-full bg-gradient-to-br from-[#fefdfb] via-[#fff8f3] to-[#fff5ef] rounded-3xl shadow-2xl p-12 border border-white overflow-hidden" 
        style={{ minHeight: '600px', height: '75vh', maxHeight: '800px' }}
      >
        {/* Decorative background sparkles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-2 h-2 bg-[#a95757]/20 rounded-full animate-ping" />
          <div className="absolute top-32 right-20 w-3 h-3 bg-[#c1b6a4]/20 rounded-full animate-pulse" />
          <div className="absolute bottom-24 left-24 w-2 h-2 bg-[#a95757]/20 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Glowing SVG Path */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ filter: 'drop-shadow(0 0 8px rgba(169, 87, 87, 0.3))' }}>
          <defs>
            {/* Glowing gradient for path */}
            <linearGradient id="pathGlow" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#ff9a8b" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#ffd89b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#a18cd1" stopOpacity="0.6" />
            </linearGradient>
            
            {/* Animated glow effect */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Main path with glow */}
          <motion.path
            d={pathData}
            fill="none"
            stroke="url(#pathGlow)"
            strokeWidth="1.5"
            strokeLinecap="round"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.5, ease: 'easeInOut', delay: 0.2 }}
          />
        </svg>

        {/* 3D Floating Module Nodes */}
        {modules.map((module, index) => {
          const position = getNodePosition(index, modules.length);
          
          // Glossy 3D gradient colors
          const gradients = [
            'from-pink-400 via-rose-400 to-pink-600',
            'from-amber-300 via-yellow-400 to-orange-500',
            'from-purple-400 via-violet-500 to-indigo-600'
          ];
          const gradient = gradients[index % gradients.length];
          
          return (
            <motion.div
              key={module.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${position.x}%`, top: `${position.y}%` }}
              initial={false}
              animate={{ 
                scale: 1, 
                opacity: 1,
                y: [0, -8, 0] // Floating animation
              }}
              transition={{
                delay: 0.6 + index * 0.12,
                type: 'spring',
                stiffness: 200,
                damping: 15,
                y: {
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: index * 0.3
                }
              }}
            >
              {/* Glow ring for current module */}
              {index === 0 && (
                <motion.div 
                  className="absolute inset-0 w-28 h-28 -m-6 rounded-full blur-2xl opacity-40"
                  style={{ background: 'radial-gradient(circle, rgba(255,154,139,0.6) 0%, transparent 70%)' }}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}

              {/* 3D Glossy Badge */}
              <motion.button
                whileHover={{ scale: 1.15, rotate: [0, -3, 3, 0] }}
                whileTap={{ scale: 0.9 }}
                className={`relative w-24 h-24 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 bg-gradient-to-br ${gradient} shadow-2xl`}
                style={{
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 10px 20px rgba(0,0,0,0.1), inset 0 -3px 10px rgba(0,0,0,0.2), inset 0 3px 10px rgba(255,255,255,0.3)'
                }}
                aria-label={`Module ${index + 1}: ${module.title}`}
              >
                {/* Glossy highlight overlay */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/40 via-transparent to-transparent" style={{ clipPath: 'ellipse(70% 40% at 50% 20%)' }} />
                
                {/* Icon with drop shadow */}
                <div className="relative z-10 drop-shadow-lg">
                  {index === 0 && <Star className="w-11 h-11 text-white" fill="white" />}
                  {index === modules.length - 1 && <Trophy className="w-11 h-11 text-white" />}
                  {index > 0 && index < modules.length - 1 && <Zap className="w-11 h-11 text-white" />}
                </div>

                {/* Glassmorphic number badge */}
                <motion.div 
                  className="absolute -top-2 -right-2 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-xl backdrop-blur-md border-2 border-white/50"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                    color: '#262626'
                  }}
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {index + 1}
                </motion.div>

                {/* Completion checkmark with pulse */}
                <motion.div 
                  className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-lg"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500" />
                </motion.div>

                {/* 3D depth effect */}
                <div className="absolute inset-0 rounded-full" style={{ boxShadow: 'inset 0 -4px 8px rgba(0,0,0,0.2)' }} />
              </motion.button>

              {/* Star rating with glow */}
              <div className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                {[1, 2, 3].map((i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 drop-shadow-md ${
                      i <= Math.min(module.topics?.length || 0, 3)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-300 fill-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Enhanced tooltip with glassmorphism */}
              <div className="absolute top-28 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 whitespace-nowrap">
                <motion.div 
                  className="px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/30"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(38,38,38,0.95) 0%, rgba(38,38,38,0.9) 100%)'
                  }}
                  initial={{ y: -10, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                >
                  <div className="font-bold text-white mb-1 flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    {module.title}
                  </div>
                  <div className="text-xs text-gray-300">{module.topics?.length || 0} topics to master</div>
                </motion.div>
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
