import React from 'react';
import { Mail, Phone, Instagram, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSEO } from '../hooks/useSEO';

export function Contact() {
    useSEO({
        title: 'Contact Us – Cozee™ India',
        description: 'Have a question about your Cozee™ order, our Premium Winterwear, or our wearable blanket hoodies? Get in touch with us via email, phone, or Instagram.',
        canonical: 'https://thecozee.in/contact',
    });


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        const subject = encodeURIComponent(`New Inquiry from ${name} (via thecozee.in)`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

        window.location.href = `mailto:harsh@thecozee.in?subject=${subject}&body=${body}`;
    };

    return (
        <main className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
            >
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-[var(--color-rojo)] mb-4 uppercase">
                    Contact Us
                </h1>
                <p className="text-lg md:text-xl text-[var(--color-rojo)]/70 max-w-2xl mx-auto">
                    Have a question about your order or our products? We'd love to hear from you.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
                {/* Contact Information */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <h2 className="text-3xl font-bold text-[var(--color-rojo)] mb-8 uppercase tracking-tight">Get in Touch</h2>

                    <div className="space-y-8">
                        <a
                            href="mailto:harsh@thecozee.in"
                            className="flex items-center gap-6 group hover:translate-x-2 transition-transform duration-300"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-[var(--color-rojo)]/5 flex items-center justify-center text-[var(--color-rojo)] group-hover:bg-[var(--color-rojo)] group-hover:text-[var(--color-crema)] transition-colors">
                                <Mail size={24} />
                            </div>
                            <div>
                                <p className="text-sm uppercase tracking-widest text-[var(--color-rojo)]/50 font-bold mb-1">Email</p>
                                <p className="text-xl font-medium text-[var(--color-rojo)]">harsh@thecozee.in</p>
                            </div>
                        </a>

                        <a
                            href="tel:+919353230603"
                            className="flex items-center gap-6 group hover:translate-x-2 transition-transform duration-300"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-[var(--color-rojo)]/5 flex items-center justify-center text-[var(--color-rojo)] group-hover:bg-[var(--color-rojo)] group-hover:text-[var(--color-crema)] transition-colors">
                                <Phone size={24} />
                            </div>
                            <div>
                                <p className="text-sm uppercase tracking-widest text-[var(--color-rojo)]/50 font-bold mb-1">Phone</p>
                                <p className="text-xl font-medium text-[var(--color-rojo)]">+91 9353230603</p>
                            </div>
                        </a>

                        <a
                            href="https://www.instagram.com/the.cozee"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-6 group hover:translate-x-2 transition-transform duration-300"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-[var(--color-rojo)]/5 flex items-center justify-center text-[var(--color-rojo)] group-hover:bg-[var(--color-rojo)] group-hover:text-[var(--color-crema)] transition-colors">
                                <Instagram size={24} />
                            </div>
                            <div>
                                <p className="text-sm uppercase tracking-widest text-[var(--color-rojo)]/50 font-bold mb-1">Instagram</p>
                                <p className="text-xl font-medium text-[var(--color-rojo)]">@the.cozee</p>
                            </div>
                        </a>
                    </div>
                </motion.div>

                {/* Contact Form */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-[var(--color-rojo)]/5 p-8 md:p-12 rounded-[2.5rem] border border-[var(--color-rojo)]/10"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase tracking-widest text-[var(--color-rojo)]/60 px-1">Name</label>
                            <input
                                name="name"
                                type="text"
                                required
                                placeholder="Your name"
                                className="w-full h-14 bg-[var(--color-crema)] border border-[var(--color-rojo)]/20 rounded-2xl px-6 outline-none focus:border-[var(--color-rojo)] transition-colors text-[var(--color-rojo)]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase tracking-widest text-[var(--color-rojo)]/60 px-1">Email</label>
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="your@email.com"
                                className="w-full h-14 bg-[var(--color-crema)] border border-[var(--color-rojo)]/20 rounded-2xl px-6 outline-none focus:border-[var(--color-rojo)] transition-colors text-[var(--color-rojo)]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase tracking-widest text-[var(--color-rojo)]/60 px-1">Message</label>
                            <textarea
                                name="message"
                                required
                                rows={4}
                                placeholder="How can we help?"
                                className="w-full bg-[var(--color-crema)] border border-[var(--color-rojo)]/20 rounded-2xl p-6 outline-none focus:border-[var(--color-rojo)] transition-colors text-[var(--color-rojo)] resize-none"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full h-16 bg-[var(--color-rojo)] text-[var(--color-crema)] rounded-2xl font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
                        >
                            Send Message
                            <Send size={20} />
                        </button>
                    </form>
                </motion.div>
            </div>
        </main>
    );
}
