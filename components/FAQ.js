'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';

export default function FAQ({ data }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="py-24 bg-primary/5 dark:bg-white/[0.03]">
      <div className="section-container max-w-3xl">
        <div className="text-center mb-14">
          <p className="eyebrow mb-4">Dúvidas frequentes</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold">Perguntas frequentes</h2>
        </div>

        <div className="flex flex-col gap-4">
          {data.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                className="rounded-2xl border border-secondary/10 dark:border-white/10 bg-white dark:bg-secondary-light overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-medium pr-4">{item.question}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="text-primary flex-shrink-0"
                  >
                    <FiPlus size={18} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="px-6 pb-5 text-sm text-secondary/70 dark:text-white/70 leading-relaxed">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
