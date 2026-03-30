import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "How do I wash my Cozee?",
    answer: "Machine wash cold on a gentle cycle. Tumble dry on low heat. Do not iron or dry clean. Your Cozee will stay soft and fluffy wash after wash!"
  },
  {
    question: "What size is the Cozee?",
    answer: "Our Cozees are one-size-fits-all! They are intentionally designed to be oversized, roomy, and incredibly comfortable for both adults and teens."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship worldwide! Shipping costs and delivery times are calculated at checkout based on your location."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 7-day return policy. If you're not completely cozee with your purchase, you can return it in its original condition for a full refund."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mt-24 mb-16 border-t border-[var(--color-rojo)]/20 pt-24">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-rojo)] mb-12 text-center tracking-tight">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <div 
                key={index}
                className="border border-[var(--color-rojo)]/20 rounded-2xl overflow-hidden bg-white/30 backdrop-blur-sm transition-colors hover:bg-white/50"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex justify-between items-center p-6 text-left cursor-pointer"
                >
                  <span className="text-xl font-medium text-[var(--color-rojo)] pr-8">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="text-[var(--color-rojo)] flex-shrink-0"
                  >
                    <ChevronDown size={24} />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-lg text-[var(--color-rojo)]/80 leading-relaxed">
                        {faq.answer}
                      </div>
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
