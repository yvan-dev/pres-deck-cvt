"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Bot, Factory, ShieldCheck, Target } from "lucide-react";
import { Slide } from "@/components/deck/Slide";

const proofPoints = [
    { label: "Point de départ", value: "N2 diffus", icon: Bot },
    { label: "Cible CVT", value: "N3 standard", icon: Target },
    { label: "Preuve terrain", value: "RMC", icon: ShieldCheck },
    { label: "Capacité", value: "Pôle IA", icon: Factory },
];

const CoverSlide = () => {
    return (
        <Slide
            slideKey={1}
            contentClassName="px-[5.2%] pb-[6.1%] pt-[6.5%]"
        >
            <div className="grid h-full grid-cols-[0.9fr_1.1fr] gap-8">
                <div className="relative z-10 flex flex-col justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="industrial-chip" data-tone="primary">
                            CVT / Executive Briefing
                        </span>
                        <span className="industrial-chip" data-tone="accent">
                            AOT / Delivery & IA
                        </span>
                    </div>

                    <div className="max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="industrial-kicker"
                        >
                            Think / Act / Code
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.04 }}
                            className="font-display mt-5 text-[4.9rem] font-semibold leading-[0.92] tracking-[-0.07em] text-[color:var(--aot-text)]"
                        >
                            Faire de l&apos;IA
                            <br />
                            une capacité
                            <br />
                            <span className="aot-gradient-text">de delivery</span>.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.08 }}
                            className="mt-7 max-w-xl text-xl leading-relaxed text-[color:var(--aot-text-muted)]"
                        >
                            Passer d&apos;usages individuels à une pratique AOT reproductible.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.12 }}
                        className="grid grid-cols-2 gap-3"
                    >
                        {proofPoints.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.label}
                                    className="industrial-panel flex items-center gap-4 p-4"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[color:var(--aot-border-subtle)] bg-[color:var(--aot-icon-bg)] text-[color:var(--aot-primary-hi)]">
                                        <Icon size={18} />
                                    </div>
                                    <div>
                                        <div className="industrial-kicker">{item.label}</div>
                                        <div className="mt-1 text-xl font-semibold text-[color:var(--aot-text)]">
                                            {item.value}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                </div>

                <div className="relative min-h-0 overflow-hidden rounded-[24px] border border-[color:var(--aot-border-subtle)]">
                    <Image
                        src="/generated/ai-industrial-hero.png"
                        alt="Visualisation d'un workflow IA industriel supervisé"
                        fill
                        priority
                        className="object-cover"
                        sizes="54vw"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--aot-bg-surface)_0%,transparent_34%,transparent_100%)] opacity-35" />
                    <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-4 rounded-2xl border border-[color:var(--aot-border-subtle)] bg-[rgba(5,10,8,0.72)] px-5 py-4 backdrop-blur-xl">
                        <div>
                            <div className="industrial-kicker">Présenté par</div>
                            <div className="mt-1 text-2xl font-semibold text-white">
                                Yvan Gunewou
                            </div>
                        </div>
                        <Image
                            src="/aot-logo.svg"
                            alt="AOT"
                            width={54}
                            height={54}
                            className="h-12 w-auto"
                        />
                    </div>
                </div>
            </div>
        </Slide>
    );
};

export default CoverSlide;
