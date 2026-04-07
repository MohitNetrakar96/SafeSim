import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../DesignSystem';
import type { TransactionStep } from './resultTypes';

const typeConfig: Record<TransactionStep['type'], { icon: string; color: string; lineColor: string }> = {
    approval: { icon: '🔓', color: 'text-amber-400 border-amber-400/30 bg-amber-400/10', lineColor: 'bg-amber-400' },
    transfer: { icon: '📤', color: 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10', lineColor: 'bg-cyan-400' },
    swap: { icon: '🔄', color: 'text-purple-400 border-purple-400/30 bg-purple-400/10', lineColor: 'bg-purple-400' },
    call: { icon: '📞', color: 'text-blue-400 border-blue-400/30 bg-blue-400/10', lineColor: 'bg-blue-400' },
    deploy: { icon: '🚀', color: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10', lineColor: 'bg-emerald-400' },
};

const truncateAddr = (addr: string) => `${addr.slice(0, 6)}…${addr.slice(-4)}`;

interface TransactionPreviewProps {
    steps: TransactionStep[];
}

const TransactionPreview: React.FC<TransactionPreviewProps> = ({ steps }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-xl p-6 border border-white/10"
        >
            <h3 className="text-lg font-bold text-white mb-1">Transaction Preview</h3>
            <p className="text-xs text-slate-500 mb-6">What this transaction will do, step by step</p>

            <div className="relative">
                {steps.map((step, i) => {
                    const config = typeConfig[step.type];
                    const isLast = i === steps.length - 1;

                    return (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.2, type: "spring" as const, stiffness: 200, damping: 20 }}
                            className="relative flex gap-4 pb-8 last:pb-0"
                        >
                            {/* Timeline line */}
                            {!isLast && (
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: '100%' }}
                                    transition={{ delay: 0.5 + i * 0.2, duration: 0.5 }}
                                    className={cn("absolute left-[19px] top-10 w-0.5 opacity-30", config.lineColor)}
                                />
                            )}

                            {/* Step icon */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3 + i * 0.2, type: "spring" as const, stiffness: 400, damping: 15 }}
                                className={cn(
                                    "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg border",
                                    config.color
                                )}
                            >
                                {config.icon}
                            </motion.div>

                            {/* Step content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="text-sm font-bold text-white">{step.action}</span>
                                    <span className="text-[10px] font-mono text-slate-600 uppercase tracking-wider">
                                        Step {step.id}
                                    </span>
                                </div>

                                <p className="text-sm text-slate-300 leading-relaxed">
                                    {step.description}{' '}
                                    {step.amounts && step.amounts[0] && (
                                        <span className="text-cyan-400 font-semibold font-mono">
                                            {step.amounts[0]} {step.tokenSymbol}
                                        </span>
                                    )}{' '}
                                    {step.addresses[0] && (
                                        <>
                                            <span className="text-slate-500">→</span>{' '}
                                            <span className="text-purple-400 font-mono text-xs bg-purple-400/5 px-1.5 py-0.5 rounded border border-purple-400/10">
                                                {truncateAddr(step.addresses[step.addresses.length > 1 ? 1 : 0])}
                                            </span>
                                        </>
                                    )}
                                </p>

                                {/* Swap specific: show output */}
                                {step.type === 'swap' && step.amounts && step.amounts.length > 1 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6 + i * 0.2 }}
                                        className="mt-2 text-xs text-emerald-400 bg-emerald-400/5 border border-emerald-400/10 rounded-lg px-3 py-1.5 inline-flex items-center gap-1.5"
                                    >
                                        <span>≈ You receive</span>
                                        <span className="font-mono font-bold">{step.amounts[1]} {step.tokenSymbol}</span>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default TransactionPreview;
