import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../DesignSystem';
import type { GasEstimate } from './resultTypes';

interface GasEstimationProps {
    gas: GasEstimate;
}

const GasEstimation: React.FC<GasEstimationProps> = ({ gas }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [animatedGas, setAnimatedGas] = useState(0);
    const maxGas = 300000; // visual scale max

    // Animate gas fill
    useEffect(() => {
        const duration = 1200;
        const start = Date.now();
        const target = gas.gasUnits;

        const animate = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setAnimatedGas(Math.round(target * eased));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [gas.gasUnits]);

    // Canvas gauge
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const w = canvas.width = 320;
        const h = canvas.height = 40;

        ctx.clearRect(0, 0, w, h);

        // Background bar
        const barY = 10;
        const barH = 20;
        const borderRadius = 10;

        ctx.beginPath();
        ctx.roundRect(0, barY, w, barH, borderRadius);
        ctx.fillStyle = 'rgba(255,255,255,0.03)';
        ctx.fill();

        // Fill
        const fillRatio = Math.min(animatedGas / maxGas, 1);
        const fillW = Math.max(fillRatio * w, borderRadius * 2);

        // Color gradient
        const gradient = ctx.createLinearGradient(0, 0, w, 0);
        gradient.addColorStop(0, '#34d399');      // emerald
        gradient.addColorStop(0.5, '#fbbf24');    // amber
        gradient.addColorStop(1, '#ef4444');      // red

        ctx.beginPath();
        ctx.roundRect(0, barY, fillW, barH, borderRadius);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = fillRatio < 0.5 ? 'rgba(52,211,153,0.4)' : 'rgba(251,191,36,0.4)';
        ctx.beginPath();
        ctx.roundRect(0, barY, fillW, barH, borderRadius);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Average marker
        const avgRatio = Math.min(gas.avgGasForSimilar / maxGas, 1);
        const avgX = avgRatio * w;
        ctx.beginPath();
        ctx.moveTo(avgX, barY - 3);
        ctx.lineTo(avgX, barY + barH + 3);
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);

    }, [animatedGas, gas.avgGasForSimilar]);

    const efficiency = gas.gasUnits <= gas.avgGasForSimilar ? 'efficient' : 'above-avg';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-xl p-6 border border-white/10"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-white">Gas Estimation</h3>
                    <p className="text-xs text-slate-500 mt-1">Estimated transaction cost</p>
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                    className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border",
                        efficiency === 'efficient'
                            ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                            : "text-amber-400 bg-amber-400/10 border-amber-400/20"
                    )}
                >
                    {efficiency === 'efficient' ? '⚡ Efficient' : '📈 Above Average'}
                </motion.div>
            </div>

            {/* Gas Meter */}
            <div className="mb-6">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span>0</span>
                    <span>Gas Usage</span>
                    <span>{maxGas.toLocaleString()}</span>
                </div>
                <canvas ref={canvasRef} className="w-full h-[40px]" style={{ maxWidth: '100%' }} />
                <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-slate-500">
                        <span className="inline-block w-3 h-0.5 bg-white/40 mr-1 align-middle" style={{ borderTop: '2px dashed rgba(255,255,255,0.4)' }} />
                        Avg: {gas.avgGasForSimilar.toLocaleString()}
                    </span>
                    <span className="text-sm font-mono text-white font-bold">
                        {animatedGas.toLocaleString()} units
                    </span>
                </div>
            </div>

            {/* Cost breakdown */}
            <div className="grid grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="rounded-lg bg-white/3 border border-white/5 p-4 text-center"
                >
                    <span className="text-[10px] text-slate-600 uppercase tracking-wider block mb-1">Gas Price</span>
                    <span className="text-lg font-bold font-mono text-white">{gas.gasPriceGwei}</span>
                    <span className="text-xs text-slate-500 ml-1">gwei</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="rounded-lg bg-white/3 border border-white/5 p-4 text-center"
                >
                    <span className="text-[10px] text-slate-600 uppercase tracking-wider block mb-1">Cost (ETH)</span>
                    <span className="text-lg font-bold font-mono text-cyan-400">{gas.estimatedCostEth}</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="rounded-lg bg-white/3 border border-white/5 p-4 text-center"
                >
                    <span className="text-[10px] text-slate-600 uppercase tracking-wider block mb-1">Cost (USD)</span>
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="text-lg font-bold font-mono text-emerald-400"
                    >
                        {gas.estimatedCostUsd}
                    </motion.span>
                </motion.div>
            </div>

            {/* Max fee */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-4 text-center text-xs text-slate-600"
            >
                Max fee per gas: <span className="font-mono text-slate-400">{gas.maxFeePerGas}</span>
            </motion.div>
        </motion.div>
    );
};

export default GasEstimation;
