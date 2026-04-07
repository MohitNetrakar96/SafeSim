// Result types for Simulation Results View

export type SimulationStatus = 'success' | 'warning' | 'danger';

export interface SimulationResultData {
    status: SimulationStatus;
    statusMessage: string;
    // Transaction preview
    transactionSteps: TransactionStep[];
    // State changes
    stateChanges: StateChange[];
    // Risk analysis
    riskScore: number;
    securityChecks: SecurityCheck[];
    vulnerabilities: Vulnerability[];
    contractVerified: boolean;
    // Gas
    gasEstimate: GasEstimate;
}

export interface TransactionStep {
    id: number;
    action: string;       // e.g. "Transfer"
    description: string;  // plain English
    addresses: string[];
    amounts?: string[];
    tokenSymbol?: string;
    type: 'transfer' | 'approval' | 'call' | 'deploy' | 'swap';
}

export interface StateChange {
    label: string;
    token: string;
    tokenSymbol: string;
    before: string;
    after: string;
    changeType: 'increase' | 'decrease' | 'neutral';
    changeAmount: string;
}

export interface SecurityCheck {
    id: string;
    label: string;
    passed: boolean;
    detail?: string;
}

export interface Vulnerability {
    severity: 'critical' | 'high' | 'medium' | 'low';
    title: string;
    description: string;
}

export interface GasEstimate {
    gasUnits: number;
    gasPriceGwei: number;
    estimatedCostEth: string;
    estimatedCostUsd: string;
    avgGasForSimilar: number;
    maxFeePerGas: string;
}

// Mock result data
export const MOCK_RESULT: SimulationResultData = {
    status: 'success',
    statusMessage: 'Transaction simulation completed successfully. No critical issues detected.',
    transactionSteps: [
        {
            id: 1,
            action: 'Approve',
            description: 'Approve Uniswap Router to spend up to',
            addresses: ['0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'],
            amounts: ['100.00'],
            tokenSymbol: 'USDC',
            type: 'approval',
        },
        {
            id: 2,
            action: 'Transfer',
            description: 'Transfer tokens from your wallet to',
            addresses: ['0x742d35Cc6634C0532925a3b844Bc9e7595f2bD08', '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'],
            amounts: ['100.00'],
            tokenSymbol: 'USDC',
            type: 'transfer',
        },
        {
            id: 3,
            action: 'Swap',
            description: 'Swap USDC for ETH via Uniswap V3 pool',
            addresses: ['0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640'],
            amounts: ['100.00', '0.0412'],
            tokenSymbol: 'ETH',
            type: 'swap',
        },
    ],
    stateChanges: [
        {
            label: 'Your USDC Balance',
            token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            tokenSymbol: 'USDC',
            before: '1,250.00',
            after: '1,150.00',
            changeType: 'decrease',
            changeAmount: '-100.00',
        },
        {
            label: 'Your ETH Balance',
            token: '0x0000000000000000000000000000000000000000',
            tokenSymbol: 'ETH',
            before: '2.4821',
            after: '2.5233',
            changeType: 'increase',
            changeAmount: '+0.0412',
        },
        {
            label: 'USDC Approval (Uniswap)',
            token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            tokenSymbol: 'USDC',
            before: '0.00',
            after: '100.00',
            changeType: 'increase',
            changeAmount: '+100.00',
        },
    ],
    riskScore: 15,
    securityChecks: [
        { id: 'verified', label: 'Contract source code verified', passed: true },
        { id: 'proxy', label: 'Not a proxy contract', passed: true },
        { id: 'audit', label: 'Contract has been audited', passed: true, detail: 'Audited by Trail of Bits' },
        { id: 'honeypot', label: 'No honeypot detected', passed: true },
        { id: 'unlimited', label: 'No unlimited approval requested', passed: true },
        { id: 'reentrancy', label: 'No reentrancy vulnerability', passed: true },
        { id: 'owner', label: 'Owner cannot drain funds', passed: true },
        { id: 'blacklist', label: 'Address not blacklisted', passed: true },
    ],
    vulnerabilities: [],
    contractVerified: true,
    gasEstimate: {
        gasUnits: 152847,
        gasPriceGwei: 24.3,
        estimatedCostEth: '0.00371',
        estimatedCostUsd: '$12.47',
        avgGasForSimilar: 145000,
        maxFeePerGas: '28.1 gwei',
    },
};

export const MOCK_RESULT_WARNING: SimulationResultData = {
    ...MOCK_RESULT,
    status: 'warning',
    statusMessage: 'Transaction would succeed, but potential risks were detected. Review carefully before signing.',
    riskScore: 62,
    securityChecks: [
        { id: 'verified', label: 'Contract source code verified', passed: true },
        { id: 'proxy', label: 'Not a proxy contract', passed: false, detail: 'This is a proxy — logic can change' },
        { id: 'audit', label: 'Contract has been audited', passed: false, detail: 'No audit record found' },
        { id: 'honeypot', label: 'No honeypot detected', passed: true },
        { id: 'unlimited', label: 'No unlimited approval requested', passed: false, detail: 'Unlimited approval requested!' },
        { id: 'reentrancy', label: 'No reentrancy vulnerability', passed: true },
        { id: 'owner', label: 'Owner cannot drain funds', passed: false, detail: 'Owner has privilege escalation' },
        { id: 'blacklist', label: 'Address not blacklisted', passed: true },
    ],
    vulnerabilities: [
        { severity: 'high', title: 'Unlimited Token Approval', description: 'This transaction requests unlimited spending approval. The spender could drain all your USDC tokens.' },
        { severity: 'medium', title: 'Upgradeable Proxy', description: 'Contract uses a proxy pattern. The implementation can be changed by the owner at any time.' },
    ],
};
