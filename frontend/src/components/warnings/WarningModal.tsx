import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../DesignSystem';
import type { RiskPattern } from './warningTypes';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { RiskBadge } from './RiskPatterns';

// ═══════════════════════════════════════════════════════
// Animated Warning Icon
// ═══════════════════════════════════════════════════════
const WarningIcon: React.FC<{ level: RiskPattern['level'] }> = ({ level }) => {
    const color = level === 'critical' ? '#ef4444' : level === 'high' ? '#f97316' : '#fbbf24';

    return (
        <motion.div
            animate={{
                scale: [1, 1.15, 1],
                rotate: [0, -5, 5, -5, 0],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
        >
            {/* Pulse rings */}
            <motion.div
                animate={{
                    scale: [1, 2.5],
                    opacity: [0.4, 0],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-full"
                style={{ background: `radial-gradient(circle, ${color}40, transparent)` }}
            />
            <motion.div
                animate={{
                    scale: [1, 2],
                    opacity: [0.3, 0],
                }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                className="absolute inset-0 rounded-full"
                style={{ background: `radial-gradient(circle, ${color}30, transparent)` }}
            />

            <div
                className="relative w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                    background: `radial-gradient(circle at 30% 30%, ${color}30, ${color}10)`,
                    border: `2px solid ${color}50`,
                    boxShadow: `0 0 30px ${color}30`,
                }}
            >
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.194-.833-2.964 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
            </div>
        </motion.div>
    );
};


// ═══════════════════════════════════════════════════════
// Warning Modal
// ═══════════════════════════════════════════════════════
interface WarningModalProps {
    risk: RiskPattern;
    isOpen: boolean;
    onClose: () => void;
    onProceed: () => void;
}

const WarningModal: React.FC<WarningModalProps> = ({ risk, isOpen, onClose, onProceed }) => {
    const isCritical = risk.level === 'critical';
    const prefersReducedMotion = useReducedMotion();
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    const modalVariants = {
        hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: isMobile ? '100%' : 20, scale: isMobile ? 1 : 0.7, filter: 'blur(10px)' },
        visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
        exit: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: isMobile ? '100%' : 20, scale: isMobile ? 1 : 0.85, filter: 'blur(5px)' },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="warning-modal-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/70 backdrop-blur-md"
                    onClick={onClose}
                >
                    {/* Modal */}
                    <motion.div
                        key="warning-modal-content"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ type: "spring" as const, stiffness: 300, damping: 22 }}
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        className={cn(
                            "relative w-full md:max-w-md rounded-t-2xl md:rounded-2xl overflow-hidden",
                            "border shadow-2xl",
                            isCritical
                                ? "border-red-500/30 shadow-red-500/10 bg-slate-950"
                                : "border-amber-500/30 shadow-amber-500/10 bg-slate-950"
                        )}
                    >
                        {/* Top glow */}
                        <div className={cn(
                            "absolute top-0 left-0 right-0 h-32 pointer-events-none",
                            isCritical
                                ? "bg-gradient-to-b from-red-500/10 to-transparent"
                                : "bg-gradient-to-b from-amber-500/10 to-transparent"
                        )} />

                        {/* Content */}
                        <div className="relative p-8 text-center">
                            {/* Animated Icon */}
                            <div className="flex justify-center mb-6">
                                <WarningIcon level={risk.level} />
                            </div>

                            {/* Badge */}
                            <div className="flex justify-center mb-4">
                                <RiskBadge level={risk.level} className="text-xs px-3 py-1" />
                            </div>

                            {/* Title */}
                            <motion.h3
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="text-2xl font-black text-white mb-3"
                            >
                                {risk.title}
                            </motion.h3>

                            {/* Description with animated underline */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.25 }}
                                className="relative mb-4"
                            >
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    {risk.description}
                                </p>
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
                                    className={cn(
                                        "h-px mt-4 mx-auto max-w-[200px] origin-left",
                                        isCritical ? "bg-red-500/30" : "bg-amber-500/30"
                                    )}
                                />
                            </motion.div>

                            {/* Detail */}
                            {risk.detail && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.35 }}
                                    className="text-xs text-slate-500 mb-8 bg-white/3 border border-white/5 rounded-lg p-3"
                                >
                                    💡 {risk.detail}
                                </motion.p>
                            )}

                            {/* Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.45 }}
                                className="flex gap-3"
                            >
                                {/* Cancel - safe option (prominent) */}
                                <motion.button
                                    whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(52,211,153,0.2)' }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={onClose}
                                    className="flex-1 py-3 px-4 min-h-[48px] rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-sm hover:bg-emerald-500/20 transition-colors"
                                >
                                    ← Cancel (Safe)
                                </motion.button>

                                {/* Proceed - dangerous option (subdued) */}
                                <motion.button
                                    whileHover={{
                                        scale: 1.03,
                                        boxShadow: isCritical ? '0 0 20px rgba(239,68,68,0.2)' : '0 0 20px rgba(251,191,36,0.2)',
                                    }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={onProceed}
                                    className={cn(
                                        "flex-1 py-3 px-4 min-h-[48px] rounded-xl border text-sm font-medium transition-colors",
                                        isCritical
                                            ? "bg-red-500/5 border-red-500/20 text-red-400/70 hover:text-red-400 hover:bg-red-500/10"
                                            : "bg-amber-500/5 border-amber-500/20 text-amber-400/70 hover:text-amber-400 hover:bg-amber-500/10"
                                    )}
                                >
                                    Proceed Anyway →
                                </motion.button>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WarningModal;
