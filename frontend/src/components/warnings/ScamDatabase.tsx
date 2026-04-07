import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../DesignSystem';
import type { ScamMatch, RiskLevel } from './warningTypes';

// ═══════════════════════════════════════════════════════
// Glitch Text Effect
// ═══════════════════════════════════════════════════════
const GlitchText: React.FC<{ children: string }> = ({ children }) => (
    <div className="relative inline-block">
        {/* Main text */}
        <span className="relative z-10 text-red-500 font-black text-3xl md:text-4xl tracking-[0.3em] uppercase">
            {children}
        </span>
        {/* Glitch layers */}
        <motion.span
            animate={{
                x: [0, -3, 2, -1, 0],
                opacity: [0, 1, 0, 1, 0],
            }}
            transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2 }}
            className="absolute inset-0 text-cyan-400 font-black text-3xl md:text-4xl tracking-[0.3em] uppercase z-0"
            style={{ clipPath: 'inset(10% 0 60% 0)' }}
            aria-hidden="true"
        >
            {children}
        </motion.span>
        <motion.span
            animate={{
                x: [0, 3, -2, 1, 0],
                opacity: [0, 1, 0, 1, 0],
            }}
            transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2, delay: 0.05 }}
            className="absolute inset-0 text-pink-500 font-black text-3xl md:text-4xl tracking-[0.3em] uppercase z-0"
            style={{ clipPath: 'inset(50% 0 20% 0)' }}
            aria-hidden="true"
        >
            {children}
        </motion.span>
    </div>
);


// ═══════════════════════════════════════════════════════
// Glitch Scanlines (layered over banner)
// ═══════════════════════════════════════════════════════
const Scanlines: React.FC = () => (
    <motion.div
        animate={{ y: ['-100%', '100%'] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 pointer-events-none z-20"
        style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,0,0.03) 2px, rgba(255,0,0,0.03) 4px)',
        }}
    />
);


// ═══════════════════════════════════════════════════════
// Severity Config
// ═══════════════════════════════════════════════════════
const severityConfig: Record<RiskLevel, { color: string; bg: string; border: string }> = {
    critical: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/25' },
    high: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/25' },
    medium: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/25' },
    low: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/25' },
};


// ═══════════════════════════════════════════════════════
// Scam Database Match
// ═══════════════════════════════════════════════════════
interface ScamDatabaseProps {
    match: ScamMatch;
    onBlock: () => void;
}

const ScamDatabase: React.FC<ScamDatabaseProps> = ({ match, onBlock }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative rounded-2xl overflow-hidden border border-red-500/20"
        >
            {/* ═══ DANGER BANNER ═══ */}
            <div className="relative bg-gradient-to-r from-red-950/80 via-red-900/50 to-red-950/80 py-8 text-center overflow-hidden">
                <Scanlines />

                {/* Flashing side bars */}
                <motion.div
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"
                />
                <motion.div
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                    className="absolute right-0 top-0 bottom-0 w-1 bg-red-500"
                />

                <GlitchText>DANGER</GlitchText>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-red-300/80 text-sm mt-3 relative z-10"
                >
                    Known scam pattern detected in our database
                </motion.p>

                {/* Match score */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" as const, stiffness: 300, damping: 20 }}
                    className="inline-flex items-center gap-2 mt-4 bg-red-500/15 border border-red-500/30 rounded-full px-4 py-1.5 relative z-10"
                >
                    <span className="text-xs text-red-400/70">Match confidence:</span>
                    <span className="text-sm font-black text-red-400">{match.matchScore}%</span>
                </motion.div>
            </div>

            {/* ═══ CONTENT ═══ */}
            <div className="bg-slate-950 p-6 space-y-6">
                {/* Pattern info */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h4 className="text-lg font-bold text-white">{match.patternName}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                            First reported: {match.firstReported} · {match.reportCount} reports
                        </p>
                    </div>
                </div>

                {/* ═══ RED FLAGS ═══ */}
                <div>
                    <h5 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        🚩 Red Flags ({match.redFlags.length})
                    </h5>
                    <div className="space-y-2">
                        {match.redFlags.map((flag, i) => {
                            const config = severityConfig[flag.severity];
                            return (
                                <motion.div
                                    key={flag.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + i * 0.08 }}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-2.5 rounded-lg border",
                                        config.border, config.bg
                                    )}
                                >
                                    <span className="text-base">{flag.icon}</span>
                                    <span className={cn("text-sm font-medium", config.color)}>
                                        {flag.label}
                                    </span>
                                    <span className={cn(
                                        "ml-auto text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border",
                                        config.color, config.border
                                    )}>
                                        {flag.severity}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* ═══ SIMILAR SCAMS ═══ */}
                <div>
                    <h5 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
                        🔍 Similar Known Scams
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {match.similarScams.map((scam, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9 + i * 0.1 }}
                                className="bg-slate-900/50 border border-white/5 rounded-lg p-3"
                            >
                                <div className="text-xs font-bold text-white mb-1">{scam.name}</div>
                                <div className="text-[10px] font-mono text-slate-600 mb-2">{scam.address}</div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-red-400 font-bold">{scam.stolenAmount}</span>
                                    <span className="text-[10px] text-slate-600">{scam.date}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* ═══ BLOCK RECOMMENDATION ═══ */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="bg-red-500/5 border border-red-500/20 rounded-xl p-5"
                >
                    <div className="flex items-start gap-3">
                        <span className="text-xl">🛑</span>
                        <div className="flex-1">
                            <h5 className="text-sm font-bold text-red-400 mb-1">Recommendation: Block this site</h5>
                            <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                We strongly recommend blocking the site that initiated this transaction.
                                This contract matches known scam patterns and interacting with it will likely result in loss of funds.
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(239,68,68,0.3)' }}
                                whileTap={{ scale: 0.97 }}
                                onClick={onBlock}
                                className="w-full py-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 font-bold text-sm hover:bg-red-500/25 transition-all"
                            >
                                🚫 Block & Report This Contract
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default ScamDatabase;
