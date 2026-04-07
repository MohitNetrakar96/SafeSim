import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../DesignSystem';
import { AnimatedNumber } from './StatusBanner';
import type { StateChange } from './resultTypes';

interface StateChangesProps {
    changes: StateChange[];
}

const StateChanges: React.FC<StateChangesProps> = ({ changes }) => {
    const [flipped, setFlipped] = useState<Record<number, boolean>>({});

    const toggleFlip = (index: number) => {
        setFlipped(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const changeConfig = {
        increase: { icon: '↑', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
        decrease: { icon: '↓', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
        neutral: { icon: '→', color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/20' },
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-xl p-6 border border-white/10"
        >
            <h3 className="text-lg font-bold text-white mb-1">State Changes</h3>
            <p className="text-xs text-slate-500 mb-6">Click a card to flip between before & after</p>

            <div className="space-y-4">
                {changes.map((change, i) => {
                    const config = changeConfig[change.changeType];
                    const isFlipped = flipped[i] ?? false;

                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            onClick={() => toggleFlip(i)}
                            className="cursor-pointer group"
                        >
                            <div className={cn(
                                "relative rounded-lg border p-4 transition-all duration-300 hover:shadow-lg",
                                config.border,
                                "bg-slate-900/60 hover:bg-slate-900/80"
                            )}>
                                <div className="flex items-center justify-between">
                                    {/* Left: Label */}
                                    <div className="flex items-center gap-3">
                                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold", config.bg, config.color)}>
                                            {config.icon}
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-white block">{change.label}</span>
                                            <span className="text-[10px] text-slate-600 font-mono">{change.tokenSymbol}</span>
                                        </div>
                                    </div>

                                    {/* Right: Values */}
                                    <div className="flex items-center gap-4">
                                        <AnimatePresence mode="wait">
                                            {!isFlipped ? (
                                                <motion.div
                                                    key="before-after"
                                                    initial={{ rotateX: -90, opacity: 0 }}
                                                    animate={{ rotateX: 0, opacity: 1 }}
                                                    exit={{ rotateX: 90, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="flex items-center gap-3"
                                                >
                                                    <div className="text-right">
                                                        <span className="text-[10px] text-slate-600 uppercase tracking-wider block">Before</span>
                                                        <span className="text-sm font-mono text-slate-400">{change.before}</span>
                                                    </div>
                                                    <motion.span
                                                        animate={{ x: [0, 4, 0] }}
                                                        transition={{ duration: 1.5, repeat: Infinity }}
                                                        className="text-slate-600"
                                                    >
                                                        →
                                                    </motion.span>
                                                    <div className="text-right">
                                                        <span className="text-[10px] text-slate-600 uppercase tracking-wider block">After</span>
                                                        <span className={cn("text-sm font-mono font-bold", config.color)}>{change.after}</span>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="change"
                                                    initial={{ rotateX: -90, opacity: 0 }}
                                                    animate={{ rotateX: 0, opacity: 1 }}
                                                    exit={{ rotateX: 90, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className={cn(
                                                        "px-4 py-2 rounded-lg font-mono font-bold text-lg",
                                                        config.bg,
                                                        config.color
                                                    )}
                                                >
                                                    <AnimatedNumber value={change.changeAmount} className="" />
                                                    <span className="text-xs ml-1 opacity-70">{change.tokenSymbol}</span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Flip indicator */}
                                        <motion.div
                                            animate={{ rotate: isFlipped ? 180 : 0 }}
                                            className="text-slate-600 text-xs"
                                        >
                                            ↻
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default StateChanges;
