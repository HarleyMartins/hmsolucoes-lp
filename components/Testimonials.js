'use client';

import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';

function Card({ t, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
      className="rounded-2xl border border-secondary/10 dark:border-white/10 bg-white dark:bg-secondary-light p-6 shadow-sm h-full flex flex-col"
    >
      <div className="flex gap-1 mb-3 text-primary">
        {Array.from({ length: t.rating }).map((_, i) => (
          <FiStar key={i} fill="currentColor" size={14} />
        ))}
      </div>
      <p className="text-sm text-secondary/80 dark:text-white/80 leading-relaxed mb-5 flex-1">
        &ldquo;{t.text}&rdquo;
      </p>
      <p className="font-medium text-sm">{t.name}</p>
    </motion.div>
  );
}

export default function Testimonials({ data }) {
  return (
    <section id="depoimentos" className="py-24 bg-primary/5 dark:bg-white/[0.03]">
      <div className="section-container">
        <div className="text-center mb-14">
          <p className="eyebrow mb-4">Depoimentos</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold">
            Empresários que já transformaram seus negócios
          </h2>
        </div>

        {/* Grade responsiva: mostra vários depoimentos por linha, sem carrossel forçado.
            Se a lista crescer, o próprio scroll natural da página resolve — sem truques. */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((t, i) => (
            <Card t={t} key={`${t.name}-${i}`} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
