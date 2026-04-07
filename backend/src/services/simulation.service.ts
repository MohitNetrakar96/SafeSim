import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { ethers } from 'ethers';

interface SimulationParams {
    from: string;
    to: string;
    value?: string;
    data?: string;
    network?: string;
}

export class SimulationService {
    private alchemy: Alchemy;
    private isMock: boolean = false;

    constructor() {
        if (!process.env.ALCHEMY_API_KEY) {
            console.warn('ALCHEMY_API_KEY not set, using mock simulation mode');
            this.isMock = true;
            this.alchemy = null as any;
        } else {
            const config = {
                apiKey: process.env.ALCHEMY_API_KEY,
                network: Network.ETH_MAINNET,
            };
            this.alchemy = new Alchemy(config);
        }
    }

    async simulateTransaction(params: SimulationParams) {
        if (this.isMock) {
            return this.mockSimulation(params);
        }

        try {
            // Use Alchemy simulation API
            const response = await this.alchemy.transact.simulateExecution({
                from: params.from,
                to: params.to,
                value: params.value ? Utils.parseEther(params.value).toString() : '0',
                data: params.data || '0x',
            }) as any;

            // Parse external calls for logs/transfers
            // Alchemy's response structure typically includes calls, logs, etc.
            // For simplicity here, we map the high-level response

            const logs = response.calls.flatMap((call: any) => call.logs || []);

            // Detect asset changes
            // Alchemy simulateTransaction returns an array of calls with details
            // We can parse balances from simulateAssetChanges if available, 
            // but simulateExecution gives trace. Let's assume simulateExecution for full trace.

            return {
                success: !response.error,
                gasUsed: response.gasUsed,
                logs,
                calls: response.calls,
                error: response.error ? { message: response.error.message, code: response.error.code } : null,
                assetChanges: [] // Would parse from calls/logs
            };

        } catch (error: any) {
            console.error('Simulation Failed:', error);
            return {
                success: false,
                error: { message: error.message || 'Simulation failed', code: error.code }
            };
        }
    }

    private mockSimulation(params: SimulationParams) {
        // Mock successful simulation
        const isApproval = params.data?.includes('095ea7b3'); // approve selector

        return {
            success: true,
            gasUsed: '45000',
            logs: isApproval ? [
                {
                    address: params.to,
                    topics: [
                        '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925', // Approval
                        ethers.zeroPadValue(params.from, 32),
                        ethers.zeroPadValue('0xSpender...', 32)
                    ],
                    data: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff' // Infinite
                }
            ] : [],
            assetChanges: [
                {
                    asset: 'ETH',
                    from: params.from,
                    to: params.to,
                    amount: params.value || '0',
                    type: 'NATIVE'
                }
            ],
            calls: [
                {
                    from: params.from,
                    to: params.to,
                    value: params.value || '0',
                    gasUsed: '21000',
                    type: 'CALL'
                }
            ],
            error: null
        };
    }
}

export const simulationService = new SimulationService();
