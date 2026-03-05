import { motion } from 'framer-motion';
import React, { ReactNode } from 'react';

interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    width?: "fit-content" | "100%";
    delay?: number;
    key?: string | number;
}

export const ScrollReveal = ({ children, width = "fit-content", delay = 0.2, key, ...rest }: ScrollRevealProps) => {
    return (
        <motion.div
            key={key}
            style={{ position: "relative", width, overflow: "hidden" }}
            variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.8, ease: "easeOut", delay }}
            viewport={{ once: true }}
        >
            {children}
        </motion.div>
    );
};
