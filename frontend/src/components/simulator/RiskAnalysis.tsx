import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../DesignSystem';
import type { SecurityCheck, Vulnerability } from './resultTypes';

// ═══════════════════════════════════════════════════════
// Risk Score Meter
// ═══════════════════════════════════════════════════════
interface RiskMeterProps {
    score: number; // 0–100
}

const RiskMeter: React.FC<RiskMeterProps> = ({ score }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [displayScore, setDisplayScore] = useState(0);

    const getScoreColor = (s: number) => {
        if (s <= 25) return { label: 'Low Risk', color: '#34d399', glow: 'rgba(52,211,153,0.3)' };
        if (s <= 50) return { label: 'Moderate', color: '#fbbf24', glow: 'rgba(251,191,36,0.3)' };
        if (s <= 75) return { label: 'High Risk', color: '#f97316', glow: 'rgba(249,115,22,0.3)' };
        return { label: 'Critical', color: '#ef4444', glow: 'rgba(239,68,68,0.3)' };
    };

    useEffect(() => {
        const duration = 1500;
        const start = Date.now();
        const animate = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayScore(Math.round(score * eased));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [score]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const size = 200;
        canvas.width = size;
        canvas.height = size;
        const center = size / 2;
        const radius = 80;
        const lineWidth = 12;
        const startAngle = 0.75 * Math.PI;  // 135°
        const endAngle = 2.25 * Math.PI;    // 405°
        const totalArc = endAngle - startAngle;

        // Clear
        ctx.clearRect(0, 0, size, size);

        // Background arc
        ctx.beginPath();
        ctx.arc(center, center, radius, startAngle, endAngle);
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Filled arc
        const fillAngle = startAngle + (totalArc * displayScore / 100);
        const scoreInfo = getScoreColor(displayScore);

        // Glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = scoreInfo.glow;

        ctx.beginPath();
        ctx.arc(center, center, radius, startAngle, fillAngle);
        ctx.strokeStyle = scoreInfo.color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.shadowBlur = 0;

    }, [displayScore]);

    const scoreInfo = getScoreColor(displayScore);

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-[200px] h-[200px]">
                <canvas ref={canvasRef} className="w-full h-full" />
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
                    <span className="text-5xl font-black text-white font-mono">{displayScore}</span>
                    <span className="text-xs text-slate-500 mt-1">/ 100</span>
                </div>
            </div>
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-sm font-bold mt-2"
                style={{ color: scoreInfo.color }}
            >
                {scoreInfo.label}
            </motion.span>
        </div>
    );
};


// ═══════════════════════════════════════════════════════
// Security Checklist
// ═══════════════════════════════════════════════════════
interface SecurityChecklistProps {
    checks: SecurityCheck[];
}

const SecurityChecklist: React.FC<SecurityChecklistProps> = ({ checks }) => {
    return (
        <div className="space-y-2">
            {checks.map((check, i) => (
                <motion.div
                    key={check.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    className="flex items-start gap-3 py-2"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6 + i * 0.08, type: "spring" as const, stiffness: 500, damping: 15 }}
                        className={cn(
                            "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5",
                            check.passed
                                ? "bg-emerald-400/20 text-emerald-400 border border-emerald-400/30"
                                : "bg-red-400/20 text-red-400 border border-red-400/30"
                        )}
                    >
                        {check.passed ? '✓' : '✕'}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                        <span className={cn(
                            "text-sm",
                            check.passed ? "text-slate-300" : "text-red-300"
                        )}>
                            {check.label}
                        </span>
                        {check.detail && (
                            <p className={cn(
                                "text-[11px] mt-0.5",
                                check.passed ? "text-slate-600" : "text-red-400/60"
                            )}>
                                {check.detail}
                            </p>
                        )}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};


// ═══════════════════════════════════════════════════════
// Vulnerabilities Section
// ═══════════════════════════════════════════════════════
const severityConfig = {
    critical: { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', icon: '🔴' },
    high: { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20', icon: '🟠' },
    medium: { color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', icon: '🟡' },
    low: { color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', icon: '🔵' },
};

interface VulnerabilitiesProps {
    vulnerabilities: Vulnerability[];
}

const Vulnerabilities: React.FC<VulnerabilitiesProps> = ({ vulnerabilities }) => {
    if (vulnerabilities.length === 0) return null;

    return (
        <div className="mt-6 space-y-3">
            <h4 className="text-sm font-bold text-red-400 uppercase tracking-wider">
                ⚠ Known Vulnerabilities ({vulnerabilities.length})
            </h4>
            {vulnerabilities.map((v, i) => {
                const config = severityConfig[v.severity];
                return (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + i * 0.15 }}
                        className={cn("rounded-lg border p-4", config.border, config.bg)}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <span>{config.icon}</span>
                            <span className={cn("text-xs font-bold uppercase tracking-wider", config.color)}>
                                {v.severity}
                            </span>
                            <span className="text-sm font-semibold text-white">{v.title}</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed ml-6">{v.description}</p>
                    </motion.div>
                );
            })}
        </div>
    );
};


// ═══════════════════════════════════════════════════════
// Main Risk Analysis Panel
// ═══════════════════════════════════════════════════════
interface RiskAnalysisProps {
    riskScore: number;
    securityChecks: SecurityCheck[];
    vulnerabilities: Vulnerability[];
    contractVerified: boolean;
}

const RiskAnalysis: React.FC<RiskAnalysisProps> = ({
    riskScore,
    securityChecks,
    vulnerabilities,
    contractVerified,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-xl p-6 border border-white/10"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-white">Risk Analysis</h3>
                    <p className="text-xs text-slate-500 mt-1">Security assessment of this transaction</p>
                </div>

                {/* Verified badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border",
                        contractVerified
                            ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                            : "text-red-400 bg-red-400/10 border-red-400/20"
                    )}
                >
                    {contractVerified ? '✓ Verified' : '✕ Unverified'}
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Risk Meter */}
                <div className="flex justify-center">
                    <RiskMeter score={riskScore} />
                </div>

                {/* Right: Security Checklist */}
                <SecurityChecklist checks={securityChecks} />
            </div>

            {/* Vulnerabilities */}
            <AnimatePresence>
                <Vulnerabilities vulnerabilities={vulnerabilities} />
            </AnimatePresence>
        </motion.div>
    );
};

export default RiskAnalysis;
