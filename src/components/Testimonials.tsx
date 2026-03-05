import { Star } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

const testimonials = [
    {
        name: "Aman Sharma",
        role: "Verified Buyer",
        content: "The Cozee hoodie is hands down the softest thing I've ever worn. It literally feels like a hug. Perfect for late nights and travel!",
        rating: 5
    },
    {
        name: "Priya Patel",
        role: "Verified Buyer",
        content: "Finally found a brand that gets oversized right. The quality of the fabric is thick and premium. Already ordered a second one in Navy!",
        rating: 5
    },
    {
        name: "Rohan Gupta",
        role: "Verified Buyer",
        content: "Minimalistic, aesthetic, and incredibly warm. I've switched all my leisurewear to Cozee. Best purchase this winter.",
        rating: 5
    }
];

export function Testimonials() {
    return (
        <section className="py-24">
            <ScrollReveal width="100%">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-[var(--color-rojo)] mb-4 uppercase tracking-tighter italic">
                        What the community says
                    </h2>
                    <div className="h-1 w-20 bg-[var(--color-rojo)] mx-auto opacity-20"></div>
                </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((t, idx) => (
                    <ScrollReveal key={idx} width="100%" delay={idx * 0.1}>
                        <div className="bg-white/50 p-8 rounded-3xl border border-[var(--color-rojo)]/10 h-full flex flex-col justify-between hover:border-[var(--color-rojo)]/30 transition-all group">
                            <div>
                                <div className="flex gap-1 mb-6">
                                    {[...Array(t.rating)].map((_, i) => (
                                        <Star key={i} size={16} fill="var(--color-rojo)" className="text-[var(--color-rojo)]" />
                                    ))}
                                </div>
                                <p className="text-xl text-[var(--color-rojo)] font-medium leading-relaxed mb-8 italic opacity-80 group-hover:opacity-100 transition-opacity">
                                    "{t.content}"
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-[var(--color-rojo)]/10 rounded-full flex items-center justify-center text-[var(--color-rojo)] font-bold text-sm">
                                    {t.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-[var(--color-rojo)]">{t.name}</h4>
                                    <p className="text-xs uppercase font-bold text-[var(--color-rojo)] opacity-40">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                ))}
            </div>
        </section>
    );
}
