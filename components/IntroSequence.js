'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';

// Uma frase individual que aparece, fica um instante em tela e depois desaparece,
// conforme uma fatia específica do progresso de scroll do container.
function Phrase({ text, progress, index, total }) {
  const segment = 1 / total;
  const start = index * segment;
  const end = start + segment;
  const fadeInEnd = start + segment * 0.28;
  const fadeOutStart = start + segment * 0.72;

  const opacity = useTransform(
    progress,
    [start, fadeInEnd, fadeOutStart, end],
    [0, 1, 1, 0]
  );
  const y = useTransform(
    progress,
    [start, fadeInEnd, fadeOutStart, end],
    [28, 0, 0, -28]
  );

  return (
    <motion.p
      style={{ opacity, y }}
      className="absolute inset-0 flex items-center justify-center text-center px-6 font-display text-3xl sm:text-5xl md:text-6xl font-semibold text-white leading-snug"
    >
      {text}
    </motion.p>
  );
}

export default function IntroSequence({ data }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const phrases = data.phrases?.length ? data.phrases : ['HM Soluções Empresariais'];
  // altura de scroll proporcional ao número de frases (cada uma "ganha" ~70% da tela para respirar)
  const heightVh = Math.max(220, phrases.length * 70);

  const glowY = useTransform(scrollYProgress, [0, 1], ['-10%', '20%']);
  const progressBar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  function handleSkip() {
    const el = containerRef.current;
    if (!el) return;
    window.scrollTo({ top: el.offsetTop + el.offsetHeight - window.innerHeight, behavior: 'smooth' });
  }

  return (
    <div ref={containerRef} style={{ height: `${heightVh}vh` }} className="relative">
      {/* Sem fade de opacidade aqui: a última frase já termina de sumir exatamente no fim
          do progresso (progress = 1), que é o mesmo instante em que o sticky solta e o
          conteúdo real do site aparece — assim não sobra nenhum "scroll morto" no meio. */}
      <div
        className="sticky top-0 h-screen w-full overflow-hidden bg-secondary dark:bg-secondary-dark flex items-center justify-center z-[60]"
      >
        {/* fundo com leve brilho dourado, com parallax próprio */}
        <motion.div
          style={{ y: glowY }}
          className="absolute -top-1/3 left-1/2 -translate-x-1/2 w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full bg-primary/15 blur-[120px] -z-10"
        />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(179,140,65,0.08),transparent_60%)]" />

        <div className="relative w-full max-w-3xl h-32 sm:h-40">
          {phrases.map((text, i) => (
            <Phrase key={i} text={text} progress={scrollYProgress} index={i} total={phrases.length} />
          ))}
        </div>

        {/* botão para pular a introdução */}
        <button
          onClick={handleSkip}
          className="absolute top-6 right-6 text-xs uppercase tracking-widest text-white/50 hover:text-primary transition-colors"
        >
          Pular introdução
        </button>

        {/* indicador de progresso */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-40 h-[3px] bg-white/15 rounded-full overflow-hidden">
          <motion.div style={{ width: progressBar }} className="h-full bg-primary" />
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="absolute bottom-16 text-white/40"
        >
          <FiChevronDown size={20} />
        </motion.div>
      </div>
    </div>
  );
}
