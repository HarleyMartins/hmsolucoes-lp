'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';

const LINKS = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#servicos', label: 'Serviços' },
  { href: '#depoimentos', label: 'Depoimentos' },
  { href: '#resultados', label: 'Resultados' },
  { href: '#faq', label: 'FAQ' },
];

export default function Navbar({ data }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const whatsappHref = `https://wa.me/${data.whatsappNumber}?text=${encodeURIComponent(
    'Olá! Vim pelo site e quero saber mais sobre a consultoria.'
  )}`;

  return (
    // A navbar nunca "gruda" nas bordas da tela: sempre flutua com margem e cantos arredondados,
    // apenas fica mais compacta e opaca conforme o scroll.
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <motion.div
        animate={{
          paddingTop: scrolled ? 10 : 18,
          paddingBottom: scrolled ? 10 : 18,
          boxShadow: scrolled
            ? '0 10px 30px -10px rgba(1,25,35,0.35)'
            : '0 6px 20px -12px rgba(1,25,35,0.25)',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`pointer-events-auto w-full max-w-6xl rounded-2xl px-6 flex items-center justify-between backdrop-blur-md border transition-colors duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-secondary-dark/95 border-secondary/5 dark:border-white/10'
            : 'bg-white/70 dark:bg-secondary-dark/70 border-primary/20 dark:border-white/10'
        }`}
      >
        <a href="#top" className="flex items-baseline gap-2 font-display text-secondary dark:text-white">
          <span className="text-xl md:text-2xl font-semibold tracking-wide">{data.logoText}</span>
          <span className="hidden sm:inline text-xs uppercase tracking-widest text-primary">
            {data.logoBadge}
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-secondary dark:text-white/90">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-primary transition-colors">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* <ThemeToggle className="hidden sm:flex" /> */}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
          >
            {data.ctaText}
          </a>
          <button
            className="md:hidden text-2xl text-secondary dark:text-white"
            aria-label="Abrir menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </motion.div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-auto absolute top-24 w-[92%] max-w-6xl rounded-2xl bg-white dark:bg-secondary-dark text-secondary dark:text-white shadow-xl border border-primary/20 dark:border-white/10 p-6 flex flex-col gap-4 md:hidden"
        >
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-base font-medium"
            >
              {link.label}
            </a>
          ))}
          {/* <ThemeToggle /> */}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-white"
          >
            {data.ctaText}
          </a>
        </motion.div>
      )}
    </header>
  );
}
