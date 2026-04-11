"use client";

import { motion } from "framer-motion";
import { Slide } from "@/components/deck/Slide";
import { SectionEyebrow } from "@/components/shared/SectionEyebrow";
import { MaturityOverview } from "@/components/shared/MaturityOverview";

const OverviewSlide = () => (
    <Slide slideKey={6} slideNumber={6} eyebrow="Partie 2 · Maturité">
        <div className="flex h-full flex-col gap-6">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <SectionEyebrow
                    eyebrow="Vue d'ensemble"
                    title="5 niveaux de maturité IA"
                />
            </motion.div>

            <motion.div
                className="flex-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.15 }}
            >
                <MaturityOverview />
            </motion.div>
        </div>
    </Slide>
);

export default OverviewSlide;
