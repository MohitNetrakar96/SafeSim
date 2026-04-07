import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../DesignSystem';
import type { SimulationStatus } from './resultTypes';

// ═══════════════════════════════════════════════════════
// 1. STATUS BANNER
// ═══════════════════════════════════════════════════════

const statusConfig: Record<SimulationStatus, {
    icon: string;
    label: string;
    color: string;
    bgGradient: string;
    borderColor: string;
    glowColor: string;
}> = {
    success: {
        icon: '✓',
        label: 'Safe',
        color: 'text-emerald-400',
        bgGradient: 'from-emerald-500/10 to-emerald-500/5',
        borderColor: 'border-emerald-500/20',
        glowColor: 'shadow-emerald-500/10',
    },
    warning: {
        icon: '⚠',
        label: 'Caution',
        color: 'text-amber-400',
        bgGradient: 'from-amber-500/10 to-amber-500/5',
        borderColor: 'border-amber-500/20',
        glowColor: 'shadow-amber-500/10',
    },
    danger: {
        icon: '✕',
        label: 'Dangerous',
        color: 'text-red-400',
        bgGradient: 'from-red-500/10 to-red-500/5',
        borderColor: 'border-red-500/20',
        glowColor: 'shadow-red-500/10',
    },
};

interface StatusBannerProps {
    status: SimulationStatus;
    message: string;
    isLoading: boolean;
    progress: number; // 0–100
}

export const StatusBanner: React.FC<StatusBannerProps> = ({ status, message, isLoading, progress }) => {
    const config = statusConfig[status];

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
            className={cn(
                "rounded-xl border p-5 bg-gradient-to-r shadow-lg backdrop-blur-sm",
                config.bgGradient,
                config.borderColor,
                config.glowColor
            )}
        >
            <div className="flex items-center gap-4">
                {/* Icon */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring" as const, stiffness: 400, damping: 15, delay: 0.2 }}
                    className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border",
                        config.color,
                        config.borderColor,
                        `bg-gradient-to-br ${config.bgGradient}`
                    )}
                >
                    {isLoading ? (
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                    ) : (
                        config.icon
                    )}
                </motion.div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={cn("text-sm font-bold uppercase tracking-wider", config.color)}>
                            {isLoading ? 'Simulating...' : config.label}
                        </span>
                    </div>
                    <p className="text-sm text-slate-300 truncate">{message}</p>
                </div>
            </div>

            {/* Progress Bar */}
            {isLoading && (
                <div className="mt-4 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className={cn(
                            "h-full rounded-full bg-gradient-to-r",
                            status === 'success' && "from-emerald-500 to-cyan-400",
                            status === 'warning' && "from-amber-500 to-orange-400",
                            status === 'danger' && "from-red-500 to-pink-400"
                        )}
                    />
                </div>
            )}
        </motion.div>
    );
};


// ═══════════════════════════════════════════════════════
// Animated Counter (for state changes)
// ═══════════════════════════════════════════════════════
interface AnimatedNumberProps {
    value: string;
    className?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, className }) => {
    const [displayValue, setDisplayValue] = useState('0');

    useEffect(() => {
        // Animate from 0 to value over time
        const numericPart = parseFloat(value.replace(/[^0-9.-]/g, ''));
        if (isNaN(numericPart)) {
            setDisplayValue(value);
            return;
        }

        const duration = 1200;
        const startTime = Date.now();
        const prefix = value.startsWith('+') ? '+' : value.startsWith('-') ? '-' : '';
        const absTarget = Math.abs(numericPart);

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = absTarget * eased;

            // Preserve decimal places from original
            const decimals = value.includes('.') ? (value.split('.')[1]?.replace(/[^0-9]/g, '').length || 2) : 0;
            setDisplayValue(prefix + current.toFixed(decimals));

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setDisplayValue(value);
            }
        };
        requestAnimationFrame(animate);
    }, [value]);

    return <span className={className}>{displayValue}</span>;
};
