import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../DesignSystem';
import type { ContractFunction, StateMutability } from './types';

const mutabilityConfig: Record<StateMutability, { label: string; color: string; bg: string }> = {
    view: { label: 'View', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' },
    pure: { label: 'Pure', color: 'text-violet-400', bg: 'bg-violet-400/10 border-violet-400/20' },
    nonpayable: { label: 'Write', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
    payable: { label: 'Payable', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
};

interface FunctionCardProps {
    fn: ContractFunction;
    index: number;
    onSelect: (fn: ContractFunction) => void;
}

const FunctionCard: React.FC<FunctionCardProps> = ({ fn, index, onSelect }) => {
    const config = mutabilityConfig[fn.stateMutability];

    return (
        <motion.div
            layoutId={`fn-card-${fn.name}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, type: "spring" as const, stiffness: 300, damping: 25 }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(fn)}
            className="cursor-pointer group relative"
        >
            {/* Glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-br from-cyan-400/0 to-purple-500/0 group-hover:from-cyan-400/20 group-hover:to-purple-500/20 rounded-xl blur-md transition-all duration-300 opacity-0 group-hover:opacity-100" />

            <div className="relative bg-slate-900/80 border border-white/5 group-hover:border-white/15 rounded-xl p-5 backdrop-blur-sm transition-all duration-200">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <h4 className="font-mono font-semibold text-white group-hover:text-cyan-400 transition-colors text-sm">
                        {fn.name}()
                    </h4>
                    <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full border", config.bg, config.color)}>
                        {config.label}
                    </span>
                </div>

                {/* Parameters */}
                <div className="space-y-1.5">
                    {fn.params.length === 0 ? (
                        <span className="text-xs text-slate-600 italic">No parameters</span>
                    ) : (
                        fn.params.map((param, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-purple-400/80 bg-purple-400/5 px-1.5 py-0.5 rounded">
                                    {param.type}
                                </span>
                                <span className="text-xs text-slate-400 font-mono">{param.name}</span>
                            </div>
                        ))
                    )}
                </div>

                {/* Outputs */}
                {fn.outputs && fn.outputs.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider">Returns: </span>
                        <span className="text-[10px] font-mono text-cyan-400/70">
                            {fn.outputs.join(', ')}
                        </span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};


interface FunctionSelectorProps {
    functions: ContractFunction[];
    onSelect: (fn: ContractFunction) => void;
}

const FunctionSelector: React.FC<FunctionSelectorProps> = ({ functions, onSelect }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ type: "spring" as const, stiffness: 200, damping: 25 }}
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white">Contract Functions</h3>
                    <p className="text-sm text-slate-500 mt-1">{functions.length} functions found · Select one to simulate</p>
                </div>

                {/* Filter chips */}
                <div className="hidden md:flex gap-2">
                    {(['view', 'nonpayable', 'payable'] as StateMutability[]).map((m) => {
                        const config = mutabilityConfig[m];
                        const count = functions.filter(f => f.stateMutability === m).length;
                        return (
                            <span key={m} className={cn("text-[11px] px-2.5 py-1 rounded-full border", config.bg, config.color)}>
                                {config.label} ({count})
                            </span>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {functions.map((fn, index) => (
                    <FunctionCard key={fn.name} fn={fn} index={index} onSelect={onSelect} />
                ))}
            </div>
        </motion.div>
    );
};

export default FunctionSelector;
