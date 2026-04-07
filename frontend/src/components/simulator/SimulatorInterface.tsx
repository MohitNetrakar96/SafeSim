import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Badge } from '../DesignSystem';
import { NetworkSelector, AddressInput, WalletDisplay } from './InputComponents';
import FunctionSelector from './FunctionSelector';
import ParameterModal from './ParameterModal';
import SimulationResults from './SimulationResults';
import WarningSystem from '../warnings/WarningSystem';
import { NETWORKS, MOCK_FUNCTIONS } from './types';
import { MOCK_RESULT, MOCK_RESULT_WARNING } from './resultTypes';
import { detectTransactionRisks, MOCK_CONTRACT_RISKS, MOCK_SCAM_MATCH } from '../warnings/warningTypes';
import type { Network, ContractFunction } from './types';
import type { SimulationResultData } from './resultTypes';
import type { RiskPattern, ScamMatch } from '../warnings/warningTypes';
import Sidebar from '../sidebar/Sidebar';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { SimulationRecord, BookmarkedContract } from '../sidebar/sidebarTypes';

const SimulatorInterface: React.FC = () => {
    // State
    const [contractAddress, setContractAddress] = useState('');
    const [selectedNetwork, setSelectedNetwork] = useState<Network>(NETWORKS[0]);
    const [isValidating, setIsValidating] = useState(false);
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [ensName, setEnsName] = useState<string | null>(null);
    const [addressError, setAddressError] = useState<string | null>(null);
    const [showFunctions, setShowFunctions] = useState(false);
    const [selectedFn, setSelectedFn] = useState<ContractFunction | null>(null);
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulationResult, setSimulationResult] = useState<SimulationResultData | null>(null);
    const [simulationCount, setSimulationCount] = useState(0);
    const [detectedRisks, setDetectedRisks] = useState<RiskPattern[]>([]);
    const [scamMatch, setScamMatch] = useState<ScamMatch | null>(null);

    // Sidebar State
    const [history, setHistory] = useLocalStorage<SimulationRecord[]>('safesim_history', []);
    const [bookmarks, setBookmarks] = useLocalStorage<BookmarkedContract[]>('safesim_bookmarks', []);

    const MOCK_WALLET = '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD08';

    // Simulate address validation with mock ENS
    const handleAddressChange = useCallback((val: string) => {
        setContractAddress(val);
        setIsValid(null);
        setEnsName(null);
        setAddressError(null);
        setShowFunctions(false);
        setSimulationResult(null);

        if (!val) return;

        // ENS name detection
        if (val.endsWith('.eth') && val.length > 4) {
            setIsValidating(true);
            setTimeout(() => {
                setIsValidating(false);
                setIsValid(true);
                setEnsName('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
                setShowFunctions(true);
            }, 1200);
            return;
        }

        // Address validation
        if (val.startsWith('0x') && val.length === 42) {
            setIsValidating(true);
            setTimeout(() => {
                setIsValidating(false);
                if (/^0x[a-fA-F0-9]{40}$/.test(val)) {
                    setIsValid(true);
                    setShowFunctions(true);
                } else {
                    setIsValid(false);
                    setAddressError('Contains invalid characters');
                }
            }, 800);
        } else if (val.length >= 42 && !val.endsWith('.eth')) {
            setIsValid(false);
            setAddressError('Invalid address format. Must be 0x followed by 40 hex characters.');
        }
    }, []);

    // Simulate button handler
    const handleSimulate = useCallback(() => {
        if (!contractAddress) {
            setAddressError('Please enter a contract address');
            return;
        }
        if (!isValid) {
            setAddressError('Please enter a valid address');
            return;
        }
        setShowFunctions(true);
    }, [contractAddress, isValid]);

    // Function selection
    const handleFnSelect = (fn: ContractFunction) => {
        setSelectedFn(fn);
    };

    // Mock simulation
    const handleRunSimulation = (params: Record<string, string>) => {
        const fnName = selectedFn?.name ?? '';
        setSelectedFn(null);
        setIsSimulating(true);
        setSimulationResult(null);
        setDetectedRisks([]);
        setScamMatch(null);
        setSimulationCount(prev => prev + 1);

        setTimeout(() => {
            setIsSimulating(false);

            // Detect transaction-level risks
            const txRisks = detectTransactionRisks(fnName, params);
            let resultData = MOCK_RESULT;
            let finalRisks = txRisks;

            // For demo: odd runs show warnings + risks, even runs show clean
            if (simulationCount % 2 !== 0) {
                // Warning scenario with risks
                resultData = MOCK_RESULT_WARNING;
                finalRisks = [...MOCK_CONTRACT_RISKS, ...txRisks];
                setSimulationResult(resultData);
                setDetectedRisks(finalRisks);

                // Show scam match for approve functions
                if (fnName === 'approve' || fnName === 'setApprovalForAll') {
                    setScamMatch(MOCK_SCAM_MATCH);
                }
            } else {
                // Clean scenario
                resultData = MOCK_RESULT;
                setSimulationResult(resultData);
                setDetectedRisks(finalRisks);
            }

            // Save to history
            const newRecord: SimulationRecord = {
                id: Date.now().toString(),
                contractName: ensName || 'Unknown Contract',
                contractAddress: contractAddress,
                networkId: selectedNetwork.id,
                functionName: fnName,
                timestamp: Date.now(),
                riskScore: resultData.riskScore,
                riskLevel: resultData.riskScore > 50 ? 'high' : 'low'
            };
            setHistory(prev => [newRecord, ...prev].slice(0, 10));

        }, 2500);
    };

    // Sidebar Handlers
    const handleReplay = (record: SimulationRecord) => {
        setContractAddress(record.contractAddress);
        setIsValid(true); // Assume valid if in history
        setShowFunctions(true);
        // Pre-select function if possible (needs logic to find fn object)
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAddBookmark = () => {
        if (!contractAddress || bookmarks.some(b => b.address === contractAddress)) return;
        const newBookmark: BookmarkedContract = {
            id: Date.now().toString(),
            address: contractAddress,
            name: ensName || 'My Contract',
            networkId: selectedNetwork.id,
            tags: ['defi'],
            addedAt: Date.now()
        };
        setBookmarks(prev => [newBookmark, ...prev]);
    };

    const handleDeleteHistory = (id: string) => {
        setHistory(prev => prev.filter(item => item.id !== id));
    };

    const handleDeleteBookmark = (id: string) => {
        setBookmarks(prev => prev.filter(item => item.id !== id));
    };

    const handleSelectBookmark = (b: BookmarkedContract) => {
        setContractAddress(b.address);
        setIsValid(true);
        setShowFunctions(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Escape key to close modal
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && selectedFn) {
                setSelectedFn(null);
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [selectedFn]);

    return (
        <section id="simulator" className="py-16 md:py-24">
            <div className="container mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <Badge variant="info" className="mb-4">Simulator</Badge>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Transaction <span className="gradient-text">Simulator</span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Enter a contract address, select a function, and simulate the transaction to see what would happen.
                    </p>
                </motion.div>

                {/* Input Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="relative">
                        {/* Card glow */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10 rounded-2xl blur-xl pointer-events-none" />

                        <div className="relative glass rounded-2xl p-6 md:p-8 border border-white/10">
                            {/* Wallet & Network Bar */}
                            <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5">
                                <WalletDisplay address={MOCK_WALLET} isConnected={true} />
                                <div className="flex items-center gap-2">
                                    <Badge variant="safe">Mainnet</Badge>
                                </div>
                            </div>

                            {/* Form */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2">
                                    <AddressInput
                                        value={contractAddress}
                                        onChange={handleAddressChange}
                                        isValidating={isValidating}
                                        isValid={isValid}
                                        ensName={ensName}
                                        error={addressError}
                                    />
                                </div>
                                <NetworkSelector
                                    selected={selectedNetwork}
                                    onSelect={setSelectedNetwork}
                                />
                            </div>

                            {/* Simulate Button */}
                            <motion.div
                                className="mt-6 flex justify-end"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Button
                                    variant="primary"
                                    size="lg"
                                    onClick={handleSimulate}
                                    isLoading={isSimulating}
                                    className="w-full md:w-auto"
                                >
                                    {isSimulating ? 'Simulating...' : '⚡ Simulate Transaction'}
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Simulation Results */}
                <AnimatePresence>
                    {(isSimulating || simulationResult) && (
                        <SimulationResults
                            result={simulationResult}
                            isLoading={isSimulating}
                            onClose={() => setSimulationResult(null)}
                        />
                    )}
                </AnimatePresence>

                {/* Warning System */}
                <AnimatePresence>
                    {(detectedRisks.length > 0 || scamMatch) && (
                        <div className="max-w-6xl mx-auto mt-8">
                            <WarningSystem
                                risks={detectedRisks}
                                scamMatch={scamMatch}
                                onProceed={() => {
                                    setDetectedRisks([]);
                                    setScamMatch(null);
                                }}
                                onBlock={() => {
                                    setDetectedRisks([]);
                                    setScamMatch(null);
                                    setSimulationResult(null);
                                    setShowFunctions(false);
                                    setContractAddress('');
                                    setIsValid(null);
                                }}
                            />
                        </div>
                    )}
                </AnimatePresence>

                {/* Function Selector */}
                <div className="max-w-6xl mx-auto mt-10">
                    <AnimatePresence>
                        {showFunctions && (
                            <FunctionSelector
                                functions={MOCK_FUNCTIONS}
                                onSelect={handleFnSelect}
                            />
                        )}
                    </AnimatePresence>
                </div>

                {/* Parameter Modal */}
                <AnimatePresence>
                    {selectedFn && (
                        <ParameterModal
                            fn={selectedFn}
                            onClose={() => setSelectedFn(null)}
                            onSimulate={handleRunSimulation}
                        />
                    )}
                </AnimatePresence>
                {/* Sidebar */}
                <Sidebar
                    history={history}
                    bookmarks={bookmarks}
                    onReplay={handleReplay}
                    onDeleteHistory={handleDeleteHistory}
                    onSelectBookmark={handleSelectBookmark}
                    onDeleteBookmark={handleDeleteBookmark}
                    onAddBookmark={handleAddBookmark}
                />
            </div>
        </section>
    );
};

export default SimulatorInterface;
