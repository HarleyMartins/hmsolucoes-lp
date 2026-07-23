'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import HeroVisual from './HeroVisual';

export default function Hero({ data }) {
  const parts = data.title.split(data.highlight);
  const sectionRef = useRef(null);

  // Parallax: o fundo e a ilustração se movem mais devagar que o texto ao rolar a página
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const visualY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);

  return (
    <section id="top" ref={sectionRef} className="relative pt-40 md:pt-48 pb-20 overflow-hidden">
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent dark:from-primary/10"
      />
      <motion.div
        style={{ y: bgY }}
        className="absolute top-10 -right-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl -z-10"
      />

      <div className="section-container grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          style={{ y: textY }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="eyebrow mb-4">{data.eyebrow}</p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-6">
            {parts[0]}
            <span className="text-gradient-gold">{data.highlight}</span>
            {parts[1]}
          </h1>
          <p className="text-base md:text-lg text-secondary/70 dark:text-white/70 max-w-xl mb-8">
            {data.subtitle}
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <a
              href="#cta"
              className="inline-flex items-center rounded-full bg-primary px-7 py-3 text-white font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30"
            >
              {data.ctaPrimaryText}
            </a>
            <a
              href="#resultados"
              className="inline-flex items-center rounded-full border border-secondary/20 dark:border-white/30 px-7 py-3 font-medium hover:border-primary hover:text-primary transition-colors"
            >
              {data.ctaSecondaryText}
            </a>
          </div>

          <div className="flex flex-wrap gap-8">
            {data.stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl md:text-3xl font-semibold tabular-nums text-primary">
                  {stat.value}
                </p>
                <p className="text-xs uppercase tracking-wider text-secondary/60 dark:text-white/60">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          style={{ y: visualY }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  );
}
