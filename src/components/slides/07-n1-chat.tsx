"use client";

import { motion } from "framer-motion";
import { Slide } from "@/components/deck/Slide";
import { LevelCard } from "@/components/shared/LevelCard";
import { MATURITY_LEVELS } from "@/content/levels";

const N1ChatSlide = () => (
    <Slide slideKey={7} slideNumber={7} eyebrow="Partie 2 · Maturité">
        <motion.div
            className="h-full"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
        >
            <LevelCard level={MATURITY_LEVELS[0]} variant="full" />
        </motion.div>
    </Slide>
);

export default N1ChatSlide;
