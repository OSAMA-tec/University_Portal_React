import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedBackground = () => {
  return (
    <motion.svg 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
      viewBox="0 0 200 200"
    >
      <motion.circle 
        cx="100" 
        cy="100" 
        r="100" 
        fill="url(#grad)" 
        animate={{
          scale: [1, 1.2, 1],
          x: ['0%', '100%', '0%'],
          y: ['0%', '100%', '0%'],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <defs>
        <radialGradient id="grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" style={{stopColor:'#ff1c68', stopOpacity:1}} />
          <stop offset="50%" style={{stopColor:'#fffd82', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#2c69d1', stopOpacity:1}} />
        </radialGradient>
      </defs>
    </motion.svg>
  );
};