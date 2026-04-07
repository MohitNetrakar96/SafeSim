import React, { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { RiskPatternList } from './RiskPatterns';
import WarningModal from './WarningModal';
import ScamDatabase from './ScamDatabase';
import type { RiskPattern, ScamMatch } from './warningTypes';

interface WarningSystemProps {
    risks: RiskPattern[];
    scamMatch: ScamMatch | null;
    onProceed: () => void;
    onBlock: () => void;
}

const WarningSystem: React.FC<WarningSystemProps> = ({
    risks,
    scamMatch,
    onProceed,
    onBlock,
}) => {
    const [selectedRisk, setSelectedRisk] = useState<RiskPattern | null>(null);
    const [dismissed, setDismissed] = useState(false);

    const handleProceed = useCallback(() => {
        setSelectedRisk(null);
        setDismissed(true);
        onProceed();
    }, [onProceed]);

    const handleClose = useCallback(() => {
        setSelectedRisk(null);
    }, []);

    if (risks.length === 0 && !scamMatch) return null;

    return (
        <div className="space-y-6">
            {/* Scam Database Match (most critical, shown first) */}
            <AnimatePresence>
                {scamMatch && (
                    <ScamDatabase match={scamMatch} onBlock={onBlock} />
                )}
            </AnimatePresence>

            {/* Risk Pattern Cards */}
            {!dismissed && (
                <RiskPatternList
                    risks={risks}
                    onRiskClick={(risk) => {
                        if (risk.level === 'critical' || risk.level === 'high') {
                            setSelectedRisk(risk);
                        }
                    }}
                />
            )}

            {/* Warning Modal (for critical/high risks) */}
            <WarningModal
                risk={selectedRisk ?? {
                    id: '',
                    type: 'unlimited_approval',
                    level: 'high',
                    title: '',
                    description: '',
                }}
                isOpen={selectedRisk !== null}
                onClose={handleClose}
                onProceed={handleProceed}
            />
        </div>
    );
};

export default WarningSystem;
