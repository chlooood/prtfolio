import { motion, useReducedMotion } from 'motion/react';

/**
 * Reveal
 * The site's single orchestrated entrance: content lifts a few pixels and
 * fades as it scrolls into frame. Editorial motion is quiet by rule — no
 * bounce, no spring overshoot, one primitive reused everywhere so the page
 * reads as one hand.
 *
 * `index` staggers siblings within a rail.
 */
export default function Reveal({ children, index = 0, className = '' }) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px -8% 0px' }}
      transition={{
        duration: 0.62,
        delay: Math.min(index * 0.07, 0.35),
        ease: [0.22, 0.61, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
