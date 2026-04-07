import { apiClient } from '../api/client';

export interface DecodeTransactionRequest {
    contractAddress: string;
    network: string;
    functionName: string;
    params: any[];
    value?: string;
    data?: string;
}

export interface DecodeTransactionResponse {
    functionName: string;
    params: any[];
    description: string;
    estimatedGas: string;
    stateChanges: any[];
}

export interface SimulationRequest {
    from: string;
    to: string;
    value?: string;
    data?: string;
    network: string;
}

export interface SimulationResponse {
    success: boolean;
    gasUsed: string;
    logs: any[];
    traces: any[];
    error?: {
        message: string;
        reason?: string;
    };
}

export interface RiskAssessmentResponse {
    risk: {
        score: number;
        level: 'low' | 'medium' | 'high' | 'critical';
        factors: Array<{
            category: string;
            severity: string;
            description: string;
        }>;
        warnings: string[];
    };
    simulation: SimulationResponse;
}

export interface ContractInfo {
    address: string;
    network: string;
    abi: any[];
    name?: string;
    verified: boolean;
    riskScore?: number;
}

class SimulationService {
    /**
     * Decode a transaction before submission
     */
    async decodeTransaction(
        request: DecodeTransactionRequest
    ): Promise<DecodeTransactionResponse> {
        return apiClient.post<DecodeTransactionResponse>('/api/decode', request);
    }

    /**
     * Simulate a transaction
     */
    async simulateTransaction(
        request: SimulationRequest
    ): Promise<SimulationResponse> {
        return apiClient.post<SimulationResponse>('/api/simulate', request);
    }

    /**
     * Get risk assessment for a transaction
     */
    async getRiskScore(
        contractAddress: string,
        functionName: string,
        params: any[],
        value?: string,
        data?: string,
        network: string = 'mainnet',
        from?: string
    ): Promise<RiskAssessmentResponse> {
        return apiClient.post<RiskAssessmentResponse>('/api/assess-risk', {
            contractAddress,
            functionName,
            params,
            value,
            data,
            network,
            from,
        });
    }

    /**
     * Get contract information
     */
    async getContractInfo(
        address: string,
        network: string = 'mainnet'
    ): Promise<ContractInfo> {
        return apiClient.get<ContractInfo>(`/api/contract/${address}`, {
            params: { network },
        });
    }

    /**
     * Batch simulate multiple transactions
     */
    async batchSimulate(
        transactions: SimulationRequest[]
    ): Promise<SimulationResponse[]> {
        return apiClient.post<SimulationResponse[]>('/api/batch-simulate', {
            transactions,
        });
    }
}

export const simulationService = new SimulationService();
