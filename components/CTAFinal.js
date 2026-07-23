'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

export default function CTAFinal({ data }) {
  const href = `https://wa.me/${data.whatsappNumber}?text=${encodeURIComponent(
    data.whatsappMessage
  )}`;

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const blob1Y = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);
  const blob2Y = useTransform(scrollYProgress, [0, 1], ['15%', '-15%']);

  return (
    <section id="cta" className="py-24">
      <div className="section-container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl bg-secondary dark:bg-secondary-light overflow-hidden px-8 py-16 md:py-20 text-center"
        >
          <motion.div
            style={{ y: blob1Y }}
            className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/30 blur-3xl"
          />
          <motion.div
            style={{ y: blob2Y }}
            className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-primary/20 blur-3xl"
          />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mb-4">
              {data.title}
            </h2>
            <p className="text-white/70 mb-10">{data.subtitle}</p>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-white font-medium hover:bg-primary-light transition-colors shadow-lg shadow-primary/40"
            >
              <FaWhatsapp size={20} />
              {data.buttonText}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
