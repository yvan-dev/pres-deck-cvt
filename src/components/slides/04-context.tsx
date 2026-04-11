"use client";

import { motion } from "framer-motion";
import { Slide } from "@/components/deck/Slide";
import { SectionEyebrow } from "@/components/shared/SectionEyebrow";
import { MetricCard } from "@/components/shared/MetricCard";
import { MARKET_METRICS } from "@/content/metrics";

const ContextSlide = () => (
    <Slide slideKey={4} slideNumber={4} eyebrow="Partie 1 · Contexte">
        <div className="flex h-full flex-col gap-6">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <SectionEyebrow
                    eyebrow="Le constat"
                    title="Ce qui a changé en 18 mois"
                />
                <p className="mt-3 max-w-3xl text-base text-[color:var(--aot-text-muted)] lg:text-lg">
                    L&apos;IA est passée du statut d&apos;expérience à celui
                    d&apos;outil de production. Les chiffres parlent
                    d&apos;eux-mêmes.
                </p>
            </motion.div>

            {/* Métriques marché */}
            <div className="grid flex-1 grid-cols-2 gap-3 lg:grid-cols-3">
                {MARKET_METRICS.map((metric, i) => (
                    <motion.div
                        key={metric.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.08 * i + 0.1 }}
                        className={
                            /* La 5e carte prend toute la largeur restante sur 2 colonnes */
                            i === 4 ? "col-span-2 lg:col-span-1" : ""
                        }
                    >
                        <MetricCard metric={metric} className="h-full" />
                    </motion.div>
                ))}
            </div>
        </div>
    </Slide>
);

export default ContextSlide;
