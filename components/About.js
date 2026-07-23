'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FiAward } from 'react-icons/fi';

export default function About({ data }) {
  return (
    <section id="sobre" className="py-24 relative">
      <div className="section-container grid md:grid-cols-2 gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto max-w-sm"
        >
          <div className="absolute -inset-4 rounded-3xl border border-primary/30 -z-10" />
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={data.photo}
              alt={data.name}
              width={600}
              height={700}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white dark:bg-secondary-light border border-primary/30 rounded-full px-4 py-2 shadow-lg">
            <FiAward className="text-primary" />
            <span className="text-xs font-medium whitespace-nowrap">{data.badge}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <p className="eyebrow mb-4">{data.tag}</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-2">{data.name}</h2>
          <p className="text-primary font-medium mb-6">{data.role}</p>
          <p className="text-secondary/70 dark:text-white/70 leading-relaxed mb-10">{data.bio}</p>

          <div className="grid grid-cols-2 gap-6">
            {data.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-secondary/10 dark:border-white/10 p-5 hover:border-primary/40 transition-colors"
              >
                <p className="text-2xl font-semibold tabular-nums text-primary mb-1">
                  {stat.value}
                </p>
                <p className="text-xs uppercase tracking-wider text-secondary/60 dark:text-white/60">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
