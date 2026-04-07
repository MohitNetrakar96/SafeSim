import { useState } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';

interface SimulationProgress {
    stage: string;
    progress: number;
    message: string;
}

interface LiveSimulationProps {
    simulationId: string;
    onComplete?: (result: any) => void;
    onError?: (error: string) => void;
}

export function LiveSimulation({
    simulationId,
    onComplete,
    onError,
}: LiveSimulationProps) {
    const [progress, setProgress] = useState<SimulationProgress>({
        stage: 'Initializing',
        progress: 0,
        message: 'Connecting to simulation service...',
    });

    const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:3001'}/simulation/${simulationId}`;

    const { isConnected } = useWebSocket(wsUrl, {
        onMessage: (message) => {
            switch (message.type) {
                case 'progress':
                    setProgress(message.data);
                    break;
                case 'complete':
                    onComplete?.(message.data);
                    break;
                case 'error':
                    onError?.(message.data.message);
                    break;
            }
        },
        onError: (error) => {
            console.error('WebSocket error:', error);
            onError?.('Connection error');
        },
    });

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    Simulation in Progress
                </h3>
                <div className="flex items-center gap-2">
                    {isConnected ? (
                        <>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-gray-600">Live</span>
                        </>
                    ) : (
                        <>
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Connecting...</span>
                        </>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>{progress.stage}</span>
                        <span>{Math.round(progress.progress)}%</span>
                    </div>
                    <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
                            style={{ width: `${progress.progress}%` }}
                        >
                            <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-gray-600">{progress.message}</p>

                {/* Stages visualization */}
                <div className="grid grid-cols-4 gap-2 pt-4">
                    {['Preparing', 'Executing', 'Analyzing', 'Complete'].map(
                        (stage, index) => (
                            <div key={stage} className="text-center">
                                <div
                                    className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-medium transition-colors ${progress.progress > index * 25
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-400'
                                        }`}
                                >
                                    {index + 1}
                                </div>
                                <p className="text-xs text-gray-600 mt-1">{stage}</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
