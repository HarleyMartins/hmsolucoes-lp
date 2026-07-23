'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiBriefcase, FiFileText, FiUser, FiHome, FiCheck } from 'react-icons/fi';

const ICONS = [FiBriefcase, FiFileText, FiUser, FiHome];

function CategoryCard({ category, index }) {
  const Icon = ICONS[index % ICONS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="rounded-2xl bg-white/95 dark:bg-secondary-light/95 backdrop-blur border border-white/40 dark:border-white/10 p-6 shadow-xl"
    >
      <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center mb-4">
        <Icon className="text-primary" size={20} />
      </div>
      <h3 className="font-display text-lg font-semibold mb-4">{category.title}</h3>
      <ul className="flex flex-col gap-2.5">
        {category.items.filter((item) => item.trim().length > 0).map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-secondary/75 dark:text-white/75">
            <FiCheck className="text-primary mt-0.5 flex-shrink-0" size={14} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function ServicesParallax({ data }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  // camadas do fundo se movem em velocidades diferentes do scroll -> efeito parallax
  const bgY = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);
  const watermarkY = useTransform(scrollYProgress, [0, 1], ['-6%', '20%']);
  const blob1Y = useTransform(scrollYProgress, [0, 1], ['-20%', '10%']);
  const blob2Y = useTransform(scrollYProgress, [0, 1], ['15%', '-15%']);

  return (
    <section id="servicos" ref={ref} className="relative py-28 overflow-hidden bg-secondary dark:bg-secondary-dark">
      {/* fundo com parallax */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary via-secondary-dark to-secondary opacity-95 dark:from-secondary-dark dark:via-black/40 dark:to-secondary-dark" />
      </motion.div>
      <motion.div
        style={{ y: blob1Y }}
        className="absolute -top-20 left-[-10%] w-[420px] h-[420px] rounded-full bg-primary/20 blur-[100px] -z-10"
      />
      <motion.div
        style={{ y: blob2Y }}
        className="absolute bottom-[-10%] right-[-10%] w-[420px] h-[420px] rounded-full bg-primary/10 blur-[100px] -z-10"
      />
      <motion.p
        style={{ y: watermarkY }}
        className="pointer-events-none select-none absolute -top-6 left-1/2 -translate-x-1/2 font-display text-[18vw] leading-none font-semibold text-white/[0.04] whitespace-nowrap -z-10"
      >
        SERVIÇOS
      </motion.p>

      <div className="section-container relative">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <p className="eyebrow mb-4">{data.eyebrow}</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mb-4">
            {data.title}
          </h2>
          <p className="text-white/60">{data.subtitle}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.categories.map((category, i) => (
            <CategoryCard category={category} index={i} key={category.title} />
          ))}
        </div>
      </div>
    </section>
  );
}
