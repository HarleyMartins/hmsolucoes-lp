'use client';

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { motion } from 'framer-motion';

const GOLD = '#B38C41';
const GOLD_LIGHT = '#D4AF6A';
const PIE_COLORS = ['#B38C41', '#D4AF6A', '#0A2C3A', '#5A7A85'];

function Card({ title, subtitle, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl border border-secondary/10 dark:border-white/10 bg-white dark:bg-secondary-light p-6 shadow-sm"
    >
      <h3 className="font-display text-lg font-semibold mb-1">{title}</h3>
      <p className="text-xs text-secondary/60 dark:text-white/60 mb-6">{subtitle}</p>
      <div className="h-64">{children}</div>
    </motion.div>
  );
}

export default function ChartsSection({ data }) {
  return (
    <section id="resultados" className="py-24">
      <div className="section-container">
        <div className="text-center mb-14">
          <p className="eyebrow mb-4">Resultados & Indicadores</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold">
            Números que comprovam a estratégia
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card title="Crescimento de receita" subtitle="Evolução média dos clientes atendidos (%)">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.area}>
                <defs>
                  <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={GOLD} stopOpacity={0.5} />
                    <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="receita" stroke={GOLD} fill="url(#colorReceita)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Impacto por área" subtitle="Percepção de melhoria relatada pelos clientes">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.bar}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="impacto" fill={GOLD_LIGHT} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Áreas de atuação" subtitle="Distribuição dos serviços prestados">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.pie}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={45}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {data.pie.map((entry, index) => (
                    <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </section>
  );
}
