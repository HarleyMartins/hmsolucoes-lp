'use client';

import { motion } from 'framer-motion';
import { FiTrendingUp, FiCheckCircle, FiPieChart } from 'react-icons/fi';

// Ilustração leve (sem 3D/WebGL) simulando um painel de indicadores financeiros —
// transmite a mesma ideia de "contabilidade/consultoria" com custo de performance quase zero.
export default function HeroVisual() {
  const bars = [38, 55, 46, 70, 62, 88];

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* card principal */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="rounded-3xl border border-secondary/10 dark:border-white/10 bg-white dark:bg-secondary-light shadow-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-secondary/50 dark:text-white/50">
              Painel financeiro
            </p>
            <p className="font-display text-lg font-semibold">Crescimento mensal</p>
          </div>
          <span className="flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            <FiTrendingUp size={12} /> +32%
          </span>
        </div>

        <div className="flex items-end gap-2 h-32 mb-2">
          {bars.map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              whileInView={{ height: `${h}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * i, ease: 'easeOut' }}
              className={`flex-1 rounded-t-md ${
                i === bars.length - 1 ? 'bg-primary' : 'bg-primary'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-secondary/40 dark:text-white/40">
          <span>Jan</span>
          <span>Jun</span>
        </div>
      </motion.div>

      {/* badge flutuante 1 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
        transition={{ opacity: { delay: 0.5, duration: 0.5 }, scale: { delay: 0.5, duration: 0.5 }, y: { repeat: Infinity, duration: 4, ease: 'easeInOut' } }}
        className="absolute -top-6 -right-4 flex items-center gap-2 rounded-2xl bg-secondary dark:bg-secondary-dark text-white px-4 py-3 shadow-xl"
      >
        <FiPieChart className="text-primary" />
        <div className="text-xs">
          <p className="font-semibold leading-tight">Gestão completa</p>
          <p className="text-white/60 leading-tight">Financeiro & Fiscal</p>
        </div>
      </motion.div>

      {/* badge flutuante 2 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 0.7, duration: 0.5 }, scale: { delay: 0.7, duration: 0.5 }, y: { repeat: Infinity, duration: 5, ease: 'easeInOut' } }}
        className="absolute -bottom-6 -left-4 flex items-center gap-2 rounded-2xl bg-white dark:bg-secondary-light border border-secondary/10 dark:border-white/10 px-4 py-3 shadow-xl"
      >
        <FiCheckCircle className="text-primary" />
        <div className="text-xs">
          <p className="font-semibold leading-tight">Consultoria certificada</p>
          <p className="text-secondary/50 dark:text-white/50 leading-tight">+120 empresas atendidas</p>
        </div>
      </motion.div>

      {/* halo decorativo */}
      <div className="absolute inset-0 -z-10 bg-primary/20 blur-3xl rounded-full scale-90" />
    </div>
  );
}
