'use client'

import { useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
import { Button } from "@/components/ui/button";

export function Hero3D() {
  const [titleNumber, setTitleNumber] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const titles = useMemo(
    () => ["Comfort", "Warmth", "Cozeeness", "Snuggles", "Softness"],
    []
  );

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <Card className="w-full h-auto md:h-[500px] bg-[var(--color-rojo)] relative overflow-hidden mb-12 md:mb-20 border-none rounded-2xl">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="var(--color-crema)"
      />

      <div className="flex h-full flex-col md:flex-row">
        {/* Left content */}
        <div className="flex-1 px-8 py-10 md:p-12 relative z-10 flex flex-col justify-center items-start text-center md:text-left items-center md:items-start">
          <h1 className="text-4xl md:text-6xl font-bold text-[var(--color-crema)] mb-4 tracking-tight flex flex-col">
            <span>Experience the</span>
            <span>Ultimate</span>
            <span className="relative flex w-full overflow-hidden h-[1.2em] md:pb-4 md:pt-1">
              {titles.map((title, index) => (
                <motion.span
                  key={index}
                  className="absolute font-semibold"
                  initial={{ opacity: 0, y: "-100" }}
                  transition={{ type: "spring", stiffness: 50 }}
                  animate={
                    titleNumber === index
                      ? {
                        y: 0,
                        opacity: 1,
                      }
                      : {
                        y: titleNumber > index ? -150 : 150,
                        opacity: 0,
                      }
                  }
                >
                  {title}
                </motion.span>
              ))}
            </span>
          </h1>
          <p className="mt-4 text-[var(--color-crema)]/80 max-w-lg text-lg md:text-xl mb-8">
            Like a hug you can wear. Experience the ultimate comfort and see why millions are joining the Cozee Squad.
          </p>
          <Link to="/shop">
            <Button size="lg" className="gap-4 bg-[var(--color-crema)] text-[var(--color-rojo)] hover:bg-[var(--color-crema)]/90 border-none cursor-pointer">
              Shop Now <MoveRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Right content */}
        <div className="flex-1 relative hidden md:flex items-center justify-center p-4 md:p-8 pb-8 md:pb-8">
          <motion.img
            src="/red-removebg-preview.png"
            alt="Cozee Wearable"
            className="w-full h-full object-contain max-h-[300px] md:max-h-[400px] drop-shadow-2xl origin-bottom"
            animate={isMobile ? {} : {
              rotate: [0, 6, 2, 8, 1, 5, 0],
              x: [0, 15, 5, 22, 2, 12, 0],
              y: [0, -8, -2, -10, -1, -5, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 8,
              times: [0, 0.15, 0.35, 0.55, 0.75, 0.85, 1],
              ease: "easeInOut"
            }}
          />
        </div>
      </div>
    </Card>
  )
}
