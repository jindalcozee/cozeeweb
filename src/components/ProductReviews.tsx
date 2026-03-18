import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScrollReveal } from './ScrollReveal';

export function ProductReviews() {
  const reviews = [
    {
      id: 1,
      name: 'Priya S.',
      date: '2 Days Ago',
      rating: 5,
      title: 'Literally never taking this off',
      content: 'I bought this for my WFH setup and it is incredibly warm. The sherpa fleece inside is so soft. Best winter purchase ever.',
      verified: true
    },
    {
      id: 2,
      name: 'Rohan M.',
      date: '1 Week Ago',
      rating: 5,
      title: 'Perfect gift for my girlfriend',
      content: 'Got the pink one for her birthday and she loves it. The quality is way better than I expected for the price. Very thick and premium.',
      verified: true
    },
    {
      id: 3,
      name: 'Ananya D.',
      date: '2 Weeks Ago',
      rating: 5,
      title: 'So cozy and huge!',
      content: 'I was worried about the "one size fits all" but it is perfectly oversized. Goes down to my knees. The pocket is great for my phone and snacks.',
      verified: true
    }
  ];

  return (
    <section className="py-20 border-t border-[var(--color-rojo)]/10 mt-10">
      <ScrollReveal width="100%">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-rojo)] tracking-tight mb-4 uppercase">
              Real Comfort.<br />Real Reviews.
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex text-[var(--color-rojo)]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={24} fill="currentColor" />
                ))}
              </div>
              <span className="text-xl font-bold text-[var(--color-rojo)]">4.9/5</span>
              <span className="text-[var(--color-rojo)]/60 text-lg border-l border-[var(--color-rojo)]/20 pl-3 ml-1">
                Based on 248 reviews
              </span>
            </div>
          </div>
          
          <button className="px-8 py-4 border-2 border-[var(--color-rojo)] text-[var(--color-rojo)] font-bold uppercase tracking-widest rounded-full hover:bg-[var(--color-rojo)] hover:text-[var(--color-crema)] transition-all cursor-pointer whitespace-nowrap">
            Write a Review
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, idx) => (
            <motion.div 
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[var(--color-rojo)]/5 p-8 rounded-3xl border border-[var(--color-rojo)]/10 hover:border-[var(--color-rojo)]/30 transition-colors"
            >
              <div className="flex text-[var(--color-rojo)] mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              
              <h3 className="font-bold text-[var(--color-rojo)] text-xl mb-3 leading-tight">
                "{review.title}"
              </h3>
              
              <p className="text-[var(--color-rojo)]/80 mb-6 leading-relaxed">
                {review.content}
              </p>
              
              <div className="flex items-center justify-between text-sm mt-auto pt-4 border-t border-[var(--color-rojo)]/10">
                <div className="flex items-center gap-2 text-[var(--color-rojo)] font-medium">
                  <span className="w-8 h-8 rounded-full bg-[var(--color-rojo)] text-[var(--color-crema)] flex items-center justify-center font-bold text-xs">
                    {review.name.charAt(0)}
                  </span>
                  <span>{review.name}</span>
                  {review.verified && (
                    <span className="text-xs bg-[var(--color-rojo)]/10 px-2 py-1 rounded-full text-[var(--color-rojo)] ml-1">
                      Verified
                    </span>
                  )}
                </div>
                <span className="text-[var(--color-rojo)]/50">{review.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
