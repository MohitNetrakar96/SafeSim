import { useQuery, useMutation } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { simulationService } from '../services/simulationService';
import type {
    DecodeTransactionRequest,
    SimulationRequest,
    ContractInfo,
} from '../services/simulationService';

/**
 * Hook to decode a transaction
 */
export function useDecodeTransaction(
    request: DecodeTransactionRequest | null,
    options?: UseQueryOptions
) {
    return useQuery({
        queryKey: ['decode', request],
        queryFn: () => {
            if (!request) throw new Error('Request is required');
            return simulationService.decodeTransaction(request);
        },
        enabled: !!request,
        ...options,
    });
}

/**
 * Hook to simulate a transaction
 */
export function useSimulateTransaction() {
    return useMutation({
        mutationFn: (request: SimulationRequest) =>
            simulationService.simulateTransaction(request),
    });
}

/**
 * Hook to get risk assessment
 */
export function useRiskAssessment() {
    return useMutation({
        mutationFn: ({
            contractAddress,
            functionName,
            params,
            value,
            data,
            network,
            from,
        }: {
            contractAddress: string;
            functionName: string;
            params: any[];
            value?: string;
            data?: string;
            network?: string;
            from?: string;
        }) =>
            simulationService.getRiskScore(
                contractAddress,
                functionName,
                params,
                value,
                data,
                network,
                from
            ),
    });
}

/**
 * Hook to get contract information
 */
export function useContractInfo(
    address: string | null,
    network: string = 'mainnet',
    options?: UseQueryOptions<ContractInfo>
) {
    return useQuery<ContractInfo>({
        queryKey: ['contract', address, network],
        queryFn: () => {
            if (!address) throw new Error('Address is required');
            return simulationService.getContractInfo(address, network);
        },
        enabled: !!address,
        ...options,
    });
}

/**
 * Hook for batch simulations
 */
export function useBatchSimulate() {
    return useMutation({
        mutationFn: (transactions: SimulationRequest[]) =>
            simulationService.batchSimulate(transactions),
    });
}
