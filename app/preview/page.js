'use client';

import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import IntroSequence from '../../components/IntroSequence';
import Hero from '../../components/Hero';
import About from '../../components/About';
import Services from '../../components/ServicesParallax';
import Testimonials from '../../components/Testimonials';
import ChartsSection from '../../components/ChartsSection';
import FAQ from '../../components/FAQ';
import CTAFinal from '../../components/CTAFinal';
import Footer from '../../components/Footer';
import { buildThemeVars } from '../../lib/color';

export default function PreviewPage() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    // Carrega o conteúdo salvo como estado inicial
    fetch('/api/content')
      .then((r) => r.json())
      .then(setContent);

    // Escuta atualizações em tempo real enviadas pelo painel admin (postMessage)
    function handleMessage(event) {
      if (event.data?.type === 'HM_PREVIEW_UPDATE') {
        setContent(event.data.content);
      }
    }
    window.addEventListener('message', handleMessage);

    // avisa o pai (admin) que o preview está pronto para receber dados
    window.parent?.postMessage({ type: 'HM_PREVIEW_READY' }, '*');

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Aplica as cores do tema em tempo real (mesmo antes de salvar)
  useEffect(() => {
    if (!content) return;
    const vars = buildThemeVars(content.theme.primary, content.theme.secondary);
    Object.entries(vars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, [content]);

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-secondary/50">
        Carregando preview...
      </div>
    );
  }

  return (
    <main>
      {content.intro?.enabled && <IntroSequence data={content.intro} />}
      <div className="overflow-x-hidden">
        <Navbar data={content.navbar} />
        <Hero data={content.hero} />
        <About data={content.about} />
        <Services data={content.services} />
        <Testimonials data={content.testimonials} />
        <ChartsSection data={content.charts} />
        <FAQ data={content.faq} />
        <CTAFinal data={content.ctaFinal} />
        <Footer data={content.footer} />
      </div>
    </main>
  );
}
