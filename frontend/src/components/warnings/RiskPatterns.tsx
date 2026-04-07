import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../DesignSystem';
import type { RiskPattern, RiskLevel } from './warningTypes';

// ═══════════════════════════════════════════════════════
// Risk Level Badge (pulsing for high/critical)
// ═══════════════════════════════════════════════════════

const levelConfig: Record<RiskLevel, {
    label: string;
    color: string;
    bg: string;
    border: string;
    glow: string;
    pulse: boolean;
}> = {
    critical: {
        label: 'CRITICAL',
        color: 'text-red-400',
        bg: 'bg-red-500/15',
        border: 'border-red-500/30',
        glow: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]',
        pulse: true,
    },
    high: {
        label: 'HIGH',
        color: 'text-orange-400',
        bg: 'bg-orange-500/15',
        border: 'border-orange-500/30',
        glow: 'shadow-[0_0_12px_rgba(249,115,22,0.25)]',
        pulse: true,
    },
    medium: {
        label: 'MEDIUM',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/25',
        glow: '',
        pulse: false,
    },
    low: {
        label: 'LOW',
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/25',
        glow: '',
        pulse: false,
    },
};

export const RiskBadge: React.FC<{ level: RiskLevel; className?: string }> = ({ level, className }) => {
    const config = levelConfig[level];

    return (
        <motion.span
            animate={config.pulse ? {
                boxShadow: [
                    '0 0 0px rgba(239,68,68,0)',
                    '0 0 12px rgba(239,68,68,0.4)',
                    '0 0 0px rgba(239,68,68,0)',
                ],
            } : {}}
            transition={config.pulse ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : {}}
            className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest border",
                config.color, config.bg, config.border,
                className
            )}
        >
            {config.label}
        </motion.span>
    );
};


// ═══════════════════════════════════════════════════════
// Single Risk Pattern Card
// ═══════════════════════════════════════════════════════

const typeIcons: Record<string, string> = {
    unlimited_approval: '🔓',
    unverified_contract: '❓',
    recent_deployment: '🕐',
    suspicious_transfer: '💸',
    known_scam: '☠️',
    honeypot: '🍯',
    proxy_contract: '🔄',
    owner_privilege: '👑',
};

interface RiskCardProps {
    risk: RiskPattern;
    index: number;
    onClick?: () => void;
}

export const RiskCard: React.FC<RiskCardProps> = ({ risk, index, onClick }) => {
    const config = levelConfig[risk.level];
    const icon = typeIcons[risk.type] || '⚠️';

    return (
        <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ delay: index * 0.08, type: "spring" as const, stiffness: 300, damping: 25 }}
            onClick={onClick}
            className={cn(
                "relative group rounded-xl border p-4 cursor-pointer transition-all duration-200",
                config.border,
                "bg-slate-900/80 hover:bg-slate-900",
                risk.level === 'critical' && "hover:border-red-500/50",
                risk.level === 'high' && "hover:border-orange-500/50"
            )}
        >
            {/* Red glow for suspicious transfers and critical */}
            {(risk.level === 'critical' || risk.type === 'suspicious_transfer') && (
                <motion.div
                    animate={{
                        opacity: [0, 0.15, 0],
                        scale: [0.95, 1.02, 0.95],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-0 rounded-xl bg-red-500/10 pointer-events-none"
                />
            )}

            <div className="relative flex items-start gap-3">
                <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-white">{risk.title}</span>
                        <RiskBadge level={risk.level} />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{risk.description}</p>
                    {risk.detail && (
                        <p className="text-[11px] text-slate-600 mt-1 italic">{risk.detail}</p>
                    )}
                </div>
            </div>
        </motion.div>
    );
};


// ═══════════════════════════════════════════════════════
// Risk Pattern List
// ═══════════════════════════════════════════════════════

interface RiskPatternListProps {
    risks: RiskPattern[];
    onRiskClick?: (risk: RiskPattern) => void;
}

export const RiskPatternList: React.FC<RiskPatternListProps> = ({ risks, onRiskClick }) => {
    if (risks.length === 0) return null;

    const criticalCount = risks.filter(r => r.level === 'critical').length;
    const highCount = risks.filter(r => r.level === 'high').length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
        >
            {/* Summary bar */}
            <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-bold text-white">
                    ⚠ {risks.length} Risk{risks.length !== 1 ? 's' : ''} Detected
                </span>
                {criticalCount > 0 && (
                    <span className="text-[10px] text-red-400 bg-red-400/10 border border-red-400/20 px-2 py-0.5 rounded-full font-bold">
                        {criticalCount} Critical
                    </span>
                )}
                {highCount > 0 && (
                    <span className="text-[10px] text-orange-400 bg-orange-400/10 border border-orange-400/20 px-2 py-0.5 rounded-full font-bold">
                        {highCount} High
                    </span>
                )}
            </div>

            {/* Risk cards */}
            <AnimatePresence>
                <div className="space-y-3">
                    {risks.map((risk, i) => (
                        <RiskCard
                            key={risk.id}
                            risk={risk}
                            index={i}
                            onClick={() => onRiskClick?.(risk)}
                        />
                    ))}
                </div>
            </AnimatePresence>
        </motion.div>
    );
};
