import { useState } from 'react';
import { useSimulateTransaction, useRiskAssessment } from '../hooks/useSimulation';
import { LiveSimulation } from './LiveSimulation';
import { Skeleton } from './Skeleton';

interface TransactionSimulatorProps {
    contractAddress: string;
    functionName: string;
    params: any[];
    userAddress?: string;
    network?: string;
}

export function TransactionSimulator({
    contractAddress,
    functionName,
    params,
    userAddress,
    network = 'mainnet',
}: TransactionSimulatorProps) {
    const [simulationId, setSimulationId] = useState<string | null>(null);
    const [showLive, setShowLive] = useState(false);

    const {
        mutate: simulate,
        data: simulationResult,
        isLoading: isSimulating,
        error: simulationError,
    } = useSimulateTransaction();

    const {
        mutate: assessRisk,
        data: riskData,
        isLoading: isAssessing,
        error: riskError,
    } = useRiskAssessment();

    const handleSimulate = () => {
        // For complex simulations, show live progress
        if (functionName === 'batchTransfer' || params.length > 10) {
            setShowLive(true);
            setSimulationId(`sim-${Date.now()}`);
        }

        simulate(
            {
                from: userAddress || '0x0000000000000000000000000000000000000000',
                to: contractAddress,
                data: '0x', // Would encode with ethers/viem
                network,
            },
            {
                onSuccess: (result: any) => {
                    console.log('Simulation completed:', result);
                    // Automatically trigger risk assessment
                    assessRisk({
                        contractAddress,
                        functionName,
                        params,
                        network,
                        from: userAddress,
                    });
                },
                onError: (error: Error) => {
                    console.error('Simulation failed:', error);
                },
            }
        );
    };

    if (showLive && simulationId) {
        return (
            <LiveSimulation
                simulationId={simulationId}
                onComplete={(result: any) => {
                    setShowLive(false);
                    console.log('Live simulation complete:', result);
                }}
                onError={(error: string) => {
                    setShowLive(false);
                    console.error('Live simulation error:', error);
                }}
            />
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Input Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Transaction Simulator
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contract Address
                        </label>
                        <input
                            type="text"
                            value={contractAddress}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Function
                        </label>
                        <input
                            type="text"
                            value={functionName}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        />
                    </div>
                    <button
                        onClick={handleSimulate}
                        disabled={isSimulating || isAssessing}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-6 rounded-lg transition-all"
                    >
                        {isSimulating || isAssessing ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg
                                    className="animate-spin h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Simulating...
                            </span>
                        ) : (
                            'Simulate Transaction'
                        )}
                    </button>
                </div>
            </div>

            {/* Errors */}
            {(simulationError || riskError) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <svg
                            className="w-5 h-5 text-red-600 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <div>
                            <h4 className="font-medium text-red-900">Simulation Failed</h4>
                            <p className="text-sm text-red-700 mt-1">
                                {simulationError?.message || riskError?.message}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Results Section */}
            {isSimulating ? (
                <Skeleton variant="card" />
            ) : simulationResult ? (
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Simulation Results
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="text-sm font-medium text-gray-700">Status</span>
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${simulationResult.success
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                    }`}
                            >
                                {simulationResult.success ? 'Success' : 'Failed'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="text-sm font-medium text-gray-700">
                                Gas Used
                            </span>
                            <span className="text-sm font-mono text-gray-900">
                                {simulationResult.gasUsed}
                            </span>
                        </div>
                        {simulationResult.error && (
                            <div className="p-3 bg-red-50 rounded">
                                <p className="text-sm text-red-800">
                                    {simulationResult.error.message}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            ) : null}

            {/* Risk Assessment */}
            {isAssessing ? (
                <Skeleton variant="card" />
            ) : riskData ? (
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Risk Assessment
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">
                                    Risk Score
                                </span>
                                <span className="text-2xl font-bold text-gray-900">
                                    {riskData.risk.score}/100
                                </span>
                            </div>
                            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${riskData.risk.level === 'low'
                                        ? 'bg-green-500'
                                        : riskData.risk.level === 'medium'
                                            ? 'bg-yellow-500'
                                            : riskData.risk.level === 'high'
                                                ? 'bg-orange-500'
                                                : 'bg-red-500'
                                        }`}
                                    style={{ width: `${riskData.risk.score}%` }}
                                ></div>
                            </div>
                        </div>

                        {riskData.risk.warnings.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="font-medium text-gray-900">Warnings</h4>
                                {riskData.risk.warnings.map((warning: string, idx: number) => (
                                    <div
                                        key={idx}
                                        className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded"
                                    >
                                        <svg
                                            className="w-5 h-5 text-yellow-600 mt-0.5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                        </svg>
                                        <p className="text-sm text-yellow-900">{warning}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
