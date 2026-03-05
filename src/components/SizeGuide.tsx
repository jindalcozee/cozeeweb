import { motion, AnimatePresence } from 'framer-motion';
import { X, Ruler } from 'lucide-react';

interface SizeGuideProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SizeGuide({ isOpen, onClose }: SizeGuideProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[var(--color-crema)] w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-[var(--color-rojo)]/20"
                        >
                            {/* Header */}
                            <div className="bg-[var(--color-rojo)] p-8 md:p-10 text-[var(--color-crema)] relative">
                                <button
                                    onClick={onClose}
                                    className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                                >
                                    <X size={24} />
                                </button>
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                                        <Ruler size={32} />
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic">Size Guide</h2>
                                </div>
                                <p className="opacity-80 text-lg">Unisex & Oversized. Designed to fit everyone perfectly.</p>
                            </div>

                            {/* Content */}
                            <div className="p-8 md:p-12">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b-2 border-[var(--color-rojo)]/20 text-[var(--color-rojo)] uppercase text-sm font-black tracking-widest">
                                                <th className="py-4 pb-6">Measurement</th>
                                                <th className="py-4 pb-6">Inches</th>
                                                <th className="py-4 pb-6">Centimeters</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-[var(--color-rojo)]">
                                            <tr className="border-b border-[var(--color-rojo)]/10 group hover:bg-[var(--color-rojo)]/5 transition-colors">
                                                <td className="py-5 font-bold text-lg">Length</td>
                                                <td className="py-5 text-lg">37.5"</td>
                                                <td className="py-5 text-lg">95 cm</td>
                                            </tr>
                                            <tr className="border-b border-[var(--color-rojo)]/10 group hover:bg-[var(--color-rojo)]/5 transition-colors">
                                                <td className="py-5 font-bold text-lg">Chest Width</td>
                                                <td className="py-5 text-lg">75"</td>
                                                <td className="py-5 text-lg">190 cm</td>
                                            </tr>
                                            <tr className="border-b border-[var(--color-rojo)]/10 group hover:bg-[var(--color-rojo)]/5 transition-colors">
                                                <td className="py-5 font-bold text-lg">Sleeve Length</td>
                                                <td className="py-5 text-lg">25.5"</td>
                                                <td className="py-5 text-lg">65 cm</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-10 p-6 bg-[var(--color-rojo)]/5 rounded-3xl border border-[var(--color-rojo)]/10">
                                    <h4 className="font-black text-[var(--color-rojo)] uppercase tracking-wider mb-2 text-sm italic">The Cozee Philosophy</h4>
                                    <p className="text-[var(--color-rojo)]/70 leading-relaxed font-medium">
                                        Our signature <span className="text-[var(--color-rojo)] font-bold italic">Cloud-Fit™</span> pattern is engineered to provide a blanket-like feel for all body types. If you are between 4ft and 6ft 5in, the Cozee will be your new best friend.
                                    </p>
                                </div>

                                <button
                                    onClick={onClose}
                                    className="w-full mt-10 py-5 bg-[var(--color-rojo)] text-[var(--color-crema)] rounded-full font-black text-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-xl shadow-[var(--color-rojo)]/20 uppercase italic"
                                >
                                    Got it!
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
