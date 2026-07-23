'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function ThemeToggle({ className = '' }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className={`w-10 h-10 ${className}`} />;
  }

  const isDark = theme === 'dark';

  return (
    <button
      aria-label="Alternar tema"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`w-10 h-10 rounded-full flex items-center justify-center border border-primary/40 text-primary hover:bg-primary hover:text-white transition-colors duration-300 ${className}`}
    >
      {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
    </button>
  );
}
