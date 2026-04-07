import type { RiskLevel } from '../warnings/warningTypes';

export interface SimulationRecord {
    id: string;
    contractName: string;
    contractAddress: string;
    networkId: string;
    functionName: string;
    timestamp: number;
    riskScore: number;
    riskLevel: RiskLevel;
}

export interface BookmarkedContract {
    id: string;
    address: string;
    name: string;
    networkId: string;
    tags: string[];
    notes?: string;
    addedAt: number;
    riskLevel?: RiskLevel;
}
