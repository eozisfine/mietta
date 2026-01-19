'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { Box, MantineBreakpoint } from '@mantine/core';

type AnimationType =
    'fadeUp'
    | 'fadeDown'
    | 'fadeLeft'
    | 'fadeRight'
    | 'scale'
    | 'fadeIn'
    | 'fadeBlur'
    | 'fadeScale'
    | 'fadeSlide';

interface AnimatedSectionProps {
  children: ReactNode;
  delay?: number;
  animation?: AnimationType;
  visibleFrom?: MantineBreakpoint;
  hiddenFrom?: MantineBreakpoint;
}

const animations = {
  fadeUp: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
  },
  fadeDown: {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
  },
  fadeLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
  },
  fadeRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  fadeBlur: {
    initial: { opacity: 0, filter: 'blur(10px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
  },
  fadeScale: {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
  },
  fadeSlide: {
    initial: { opacity: 0, x: -30, y: 30 },
    animate: { opacity: 1, x: 0, y: 0 },
  },
};

export default function AnimatedSection({
                                          children,
                                          delay = 0,
                                          animation = 'fadeUp',
                                          visibleFrom,
                                          hiddenFrom,
                                        }: AnimatedSectionProps) {
  // Fallback to fadeUp if animation is invalid or 'none'
  const selectedAnimation = animations[animation] || animations.fadeUp;

  return (
      <Box visibleFrom={visibleFrom} hiddenFrom={hiddenFrom} w="100%">
        <motion.div
            style={{
              overflow: "hidden",
              width: "100%"
            }}
            initial={selectedAnimation.initial}
            whileInView={selectedAnimation.animate}
            viewport={{ once: false, amount: 0.2 }}
            transition={{
              duration: 0.6,
              delay,
              ease: [0.22, 1, 0.36, 1],
            }}
        >
          {children}
        </motion.div>
      </Box>
  );
}
