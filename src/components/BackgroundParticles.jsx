import React from 'react';
import { motion } from 'framer-motion';

const BackgroundParticles = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, width: '100vw', height: '100vh',
      zIndex: -1, overflow: 'hidden', pointerEvents: 'none',
      background: 'radial-gradient(circle at 50% 50%, #0f172a 0%, #020617 100%)'
    }}>
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: Math.random() * window.innerHeight,
            opacity: Math.random() * 0.5 
          }}
          animate={{
            y: [null, Math.random() * -100, Math.random() * 100],
            x: [null, Math.random() * -50, Math.random() * 50],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            width: Math.random() * 3 + 1 + 'px',
            height: Math.random() * 3 + 1 + 'px',
            backgroundColor: i % 2 === 0 ? 'var(--primary)' : 'var(--accent)',
            borderRadius: '50%',
            filter: 'blur(1px)',
            boxShadow: `0 0 10px ${i % 2 === 0 ? 'var(--primary)' : 'var(--accent)'}`
          }}
        />
      ))}
      
      {/* Glowing Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        style={{
          position: 'absolute',
          top: '-10%', left: '-10%',
          width: '50vw', height: '50vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 242, 254, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)'
        }}
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{ duration: 10, repeat: Infinity }}
        style={{
          position: 'absolute',
          bottom: '-10%', right: '-10%',
          width: '60vw', height: '60vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(189, 0, 255, 0.1) 0%, transparent 70%)',
          filter: 'blur(80px)'
        }}
      />
    </div>
  );
};

export default BackgroundParticles;
