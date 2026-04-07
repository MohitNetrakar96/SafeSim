import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button, Input, cn } from '../DesignSystem';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useHaptic } from '../../hooks/useHaptic';
import type { ContractFunction, SolidityType } from './types';
import { TYPE_HELP, TYPE_PLACEHOLDER } from './types';



interface ParameterModalProps {
    fn: ContractFunction;
    onClose: () => void;
    onSimulate: (params: Record<string, string>) => void;
}

const ParameterModal: React.FC<ParameterModalProps> = ({ fn, onClose, onSimulate }) => {
    const [params, setParams] = useState<Record<string, string>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const prefersReducedMotion = useReducedMotion();
    const { hapticProps, triggerHaptic } = useHaptic();

    // Reset params when function changes
    useEffect(() => {
        setParams({}); // Clear params when the function changes
        setErrors({}); // Clear errors as well
    }, [fn]);

    const handleChange = (name: string, value: string) => {
        setParams(prev => ({ ...prev, [name]: value }));
        // Clear error on change
        if (errors[name]) {
            setErrors(prev => {
                const next = { ...prev };
                delete next[name];
                return next;
            });
        }
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        fn.params.forEach(param => {
            const val = params[param.name]?.trim();
            if (!val) {
                newErrors[param.name] = 'This field is required';
                return;
            }
            if (param.type === 'address' && !/^0x[a-fA-F0-9]{40}$/.test(val)) {
                newErrors[param.name] = 'Invalid Ethereum address';
            }
            if (param.type === 'bool' && !['true', 'false'].includes(val.toLowerCase())) {
                newErrors[param.name] = 'Must be true or false';
            }
            if ((param.type === 'uint256' || param.type === 'uint8' || param.type === 'uint128') && (isNaN(Number(val)) || Number(val) < 0)) {
                newErrors[param.name] = 'Must be a non-negative number';
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSimulate = () => {
        if (validate()) {
            onSimulate(params);
        }
    };

    const getPlaceholder = (type: SolidityType) => TYPE_PLACEHOLDER[type] || 'Enter value...';
    const getHelperText = (type: SolidityType) => TYPE_HELP[type];

    const modalVariants = {
        hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: '100%', scale: 1 },
        visible: { opacity: 1, y: 0, scale: 1 },
        exit: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: '100%', scale: 1 },
    };

    // Desktop: center modal, Mobile: bottom sheet
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    return (
        <motion.div
            key="param-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            {/* Modal */}
            <motion.div
                key="param-modal-content"
                layoutId={`fn-card-${fn.name}`}
                variants={isMobile ? modalVariants : {
                    hidden: { opacity: 0, scale: 0.95, y: 20 },
                    visible: { opacity: 1, scale: 1, y: 0 },
                    exit: { opacity: 0, scale: 0.95, y: 20 }
                }}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                drag={isMobile ? "y" : false}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0, bottom: 0.2 }}
                onDragEnd={(_e, info) => {
                    if (info.offset.y > 100) {
                        triggerHaptic();
                        onClose();
                    }
                }}
                className="relative w-full md:max-w-xl bg-slate-900 md:rounded-2xl rounded-t-2xl border-t md:border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
                {/* Mobile Drag Handle */}
                <div className="md:hidden w-full flex justify-center pt-3 pb-1">
                    <div className="w-12 h-1.5 bg-slate-700/50 rounded-full" />
                </div>

                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-start justify-between flex-shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">{fn.name}</h3>
                        <div className="flex gap-2">
                            <span className={cn(
                                "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border",
                                fn.stateMutability === 'payable' ? "text-red-400 border-red-400/20 bg-red-400/5" :
                                    fn.stateMutability === 'view' ? "text-emerald-400 border-emerald-400/20 bg-emerald-400/5" :
                                        "text-blue-400 border-blue-400/20 bg-blue-400/5"
                            )}>
                                {fn.stateMutability}
                            </span>
                        </div>
                    </div>
                    <motion.button
                        {...hapticProps}
                        onClick={onClose}
                        className="text-slate-400 hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
                    >
                        ✕
                    </motion.button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 overflow-y-auto flex-grow custom-scrollbar overscroll-contain">
                    {fn.params.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            No parameters required for this function.
                        </div>
                    ) : (
                        fn.params.map((param, i) => (
                            <motion.div
                                key={param.name}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">
                                    {param.name} <span className="text-slate-600 font-mono text-xs">({param.type})</span>
                                </label>
                                <div className="relative group">
                                    <motion.div
                                        className={cn(
                                            "absolute -inset-0.5 rounded-lg blur-sm transition duration-300 opacity-0",
                                            errors[param.name]
                                                ? "bg-red-500/30 opacity-100"
                                                : "bg-gradient-to-r from-cyan-400/50 to-purple-500/50 group-focus-within:opacity-100"
                                        )}
                                    />
                                    <Input
                                        value={params[param.name] || ''}
                                        onChange={(e) => handleChange(param.name, e.target.value)}
                                        placeholder={getPlaceholder(param.type)}
                                        error={errors[param.name]}
                                        className="font-mono min-h-[48px]"
                                    />
                                </div>
                                <p className="text-xs text-slate-600 mt-1.5 ml-1">
                                    {getHelperText(param.type)}
                                </p>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-slate-900/50 backdrop-blur-xl">
                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            className="flex-1 min-h-[48px]"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSimulate}
                            className="flex-[2] min-h-[48px]"
                        >
                            🚀 Simulate
                        </Button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ParameterModal;
