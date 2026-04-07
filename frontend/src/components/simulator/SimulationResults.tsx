import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatusBanner } from './StatusBanner';
import TransactionPreview from './TransactionPreview';
import StateChanges from './StateChanges';
import RiskAnalysis from './RiskAnalysis';
import GasEstimation from './GasEstimation';
import type { SimulationResultData } from './resultTypes';

interface SimulationResultsProps {
    result: SimulationResultData | null;
    isLoading: boolean;
    onClose?: () => void;
}

const SimulationResults: React.FC<SimulationResultsProps> = ({ result, isLoading, onClose }) => {
    const [progress, setProgress] = useState(0);
    const [showSections, setShowSections] = useState(false);

    // Simulate loading progress
    useEffect(() => {
        if (!isLoading) {
            setProgress(100);
            const timer = setTimeout(() => setShowSections(true), 300);
            return () => clearTimeout(timer);
        }

        setShowSections(false);
        setProgress(0);
        const steps = [
            { target: 20, delay: 200 },
            { target: 45, delay: 600 },
            { target: 65, delay: 1000 },
            { target: 80, delay: 1500 },
            { target: 90, delay: 2000 },
        ];

        const timers = steps.map(step =>
            setTimeout(() => setProgress(step.target), step.delay)
        );

        return () => timers.forEach(clearTimeout);
    }, [isLoading]);

    if (!result && !isLoading) return null;

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
            },
        },
    };

    const staggerItem = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring" as const,
                stiffness: 200,
                damping: 25,
            },
        },
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-6xl mx-auto mt-10 mb-10"
        >
            {/* Status Banner - always visible during/after simulation */}
            <StatusBanner
                status={result?.status ?? 'success'}
                message={isLoading ? 'Analyzing transaction and checking for potential risks...' : (result?.statusMessage ?? '')}
                isLoading={isLoading}
                progress={progress}
            />

            {/* Result sections with stagger animation */}
            <AnimatePresence>
                {showSections && result && (
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="mt-8 space-y-6"
                    >
                        {/* Close button */}
                        {onClose && (
                            <motion.div variants={staggerItem} className="flex justify-end">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={onClose}
                                    className="text-xs text-slate-500 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20"
                                >
                                    ✕ Clear Results
                                </motion.button>
                            </motion.div>
                        )}

                        {/* 1. Transaction Preview */}
                        <motion.div variants={staggerItem}>
                            <TransactionPreview steps={result.transactionSteps} />
                        </motion.div>

                        {/* 2. State Changes + Gas side by side on desktop */}
                        <motion.div variants={staggerItem} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <StateChanges changes={result.stateChanges} />
                            <GasEstimation gas={result.gasEstimate} />
                        </motion.div>

                        {/* 3. Risk Analysis (full width) */}
                        <motion.div variants={staggerItem}>
                            <RiskAnalysis
                                riskScore={result.riskScore}
                                securityChecks={result.securityChecks}
                                vulnerabilities={result.vulnerabilities}
                                contractVerified={result.contractVerified}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default SimulationResults;
