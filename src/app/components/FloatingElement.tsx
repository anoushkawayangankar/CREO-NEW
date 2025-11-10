'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import { FloatingElementConfig } from '@/app/config/heroFloatingElements';

interface FloatingElementProps {
  config: FloatingElementConfig;
  isDarkMode: boolean;
  parallaxStrength?: number;
}

export default function FloatingElement({ config, isDarkMode, parallaxStrength = 0.02 }: FloatingElementProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const theme = isDarkMode ? config.dark : config.light;
  const Icon = config.icon;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX - window.innerWidth / 2;
      const y = e.clientY - window.innerHeight / 2;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const offsetX = useTransform(mouseX, [-window.innerWidth / 2, window.innerWidth / 2], [-20 * parallaxStrength, 20 * parallaxStrength]);
  const offsetY = useTransform(mouseY, [-window.innerHeight / 2, window.innerHeight / 2], [-15 * parallaxStrength, 15 * parallaxStrength]);

  return (
    <motion.div
      initial={{ opacity: 0, y: config.animation.initialY, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 1.2,
        delay: config.animation.delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        position: 'absolute',
        ...config.position,
        x: offsetX,
        y: offsetY,
      }}
      className="pointer-events-none z-10"
    >
      <motion.div
        animate={{
          y: [0, config.animation.initialY > 0 ? 15 : -15, 0],
        }}
        transition={{
          duration: config.animation.duration,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          backgroundColor: theme.bg,
          borderColor: theme.border,
        }}
        className={`
          backdrop-blur-md rounded-3xl border px-6 py-4 
          shadow-[0_20px_60px_rgba(0,0,0,0.12)]
          transition-colors duration-500
        `}
      >
        <div className="flex items-center gap-3">
          <div
            style={{
              backgroundColor: `${theme.iconColor}15`,
              color: theme.iconColor,
            }}
            className="rounded-2xl p-3 transition-colors duration-500"
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p
              style={{ color: theme.text }}
              className="text-sm font-semibold transition-colors duration-500"
            >
              {config.title}
            </p>
            <p
              style={{ color: `${theme.text}80` }}
              className="text-xs transition-colors duration-500"
            >
              {config.subtitle}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
