// Warning System Types & Mock Data

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';

export interface RiskPattern {
    id: string;
    type: RiskPatternType;
    level: RiskLevel;
    title: string;
    description: string;
    detail?: string;
}

export type RiskPatternType =
    | 'unlimited_approval'
    | 'unverified_contract'
    | 'recent_deployment'
    | 'suspicious_transfer'
    | 'known_scam'
    | 'honeypot'
    | 'proxy_contract'
    | 'owner_privilege';

export interface ScamMatch {
    patternName: string;
    matchScore: number;       // 0–100
    reportCount: number;
    firstReported: string;    // date string
    redFlags: RedFlag[];
    similarScams: SimilarScam[];
}

export interface RedFlag {
    id: string;
    icon: string;
    label: string;
    severity: RiskLevel;
}

export interface SimilarScam {
    name: string;
    address: string;
    stolenAmount: string;
    date: string;
}

// ─── Risk Detection Engine (Mock) ───

export function detectRisks(contractAddress: string): RiskPattern[] {
    // For demo, generate risks based on address patterns
    const risks: RiskPattern[] = [];

    // Always detect a few for any address
    if (contractAddress.toLowerCase().includes('dead') || contractAddress.toLowerCase().includes('bad')) {
        risks.push({
            id: 'scam-1',
            type: 'known_scam',
            level: 'critical',
            title: 'Known Scam Contract',
            description: 'This contract matches a known scam pattern in our database.',
            detail: 'Contract has been reported 47 times across multiple chains.',
        });
    }

    return risks;
}

export function detectTransactionRisks(
    functionName: string,
    _params: Record<string, string>
): RiskPattern[] {
    const risks: RiskPattern[] = [];

    // Unlimited approval detection
    if (functionName === 'approve') {
        const amount = _params['amount'] || '';
        const isUnlimited =
            amount === '115792089237316195423570985008687907853269984665640564039457584007913129639935' ||
            amount.toLowerCase() === 'max' ||
            amount === 'unlimited' ||
            (amount.length > 20);

        if (isUnlimited) {
            risks.push({
                id: 'unlimited-approval',
                type: 'unlimited_approval',
                level: 'critical',
                title: 'Unlimited Token Approval',
                description: 'This transaction requests unlimited spending approval. The approved address could drain ALL your tokens at any time.',
                detail: 'Consider setting a specific amount instead of max uint256.',
            });
        }
    }

    // Suspicious transfer
    if (functionName === 'transfer' || functionName === 'transferFrom') {
        risks.push({
            id: 'suspicious-transfer',
            type: 'suspicious_transfer',
            level: 'medium',
            title: 'Token Transfer Detected',
            description: 'This transaction will transfer tokens from your wallet. Verify the recipient address.',
        });
    }

    // setApprovalForAll
    if (functionName === 'setApprovalForAll') {
        risks.push({
            id: 'approval-all',
            type: 'unlimited_approval',
            level: 'high',
            title: 'Approval For All Assets',
            description: 'This grants full control over ALL your NFTs in this collection to the operator.',
            detail: 'The operator can transfer any of your NFTs without further permission.',
        });
    }

    return risks;
}

// ─── Static Mock data for scam pattern match ───

export const MOCK_SCAM_MATCH: ScamMatch = {
    patternName: 'Fake Token Airdrop Drain',
    matchScore: 94,
    reportCount: 47,
    firstReported: 'Dec 15, 2024',
    redFlags: [
        { id: 'f1', icon: '🔓', label: 'Requests unlimited token approval', severity: 'critical' },
        { id: 'f2', icon: '👻', label: 'Contract deployed less than 24h ago', severity: 'high' },
        { id: 'f3', icon: '📋', label: 'Unverified source code on Etherscan', severity: 'high' },
        { id: 'f4', icon: '🔄', label: 'Uses proxy pattern to hide logic', severity: 'medium' },
        { id: 'f5', icon: '💸', label: 'Owner can drain contract funds', severity: 'critical' },
        { id: 'f6', icon: '🚫', label: 'Honeypot: users cannot sell tokens', severity: 'critical' },
    ],
    similarScams: [
        { name: 'FakeUSDT Airdrop', address: '0x1a2b...3c4d', stolenAmount: '$2.4M', date: 'Nov 2024' },
        { name: 'Phishing Approval', address: '0x5e6f...7a8b', stolenAmount: '$890K', date: 'Oct 2024' },
        { name: 'Token Drain Bot', address: '0x9c0d...1e2f', stolenAmount: '$1.1M', date: 'Sep 2024' },
    ],
};

export const MOCK_CONTRACT_RISKS: RiskPattern[] = [
    {
        id: 'unverified',
        type: 'unverified_contract',
        level: 'high',
        title: 'Unverified Contract',
        description: 'Source code is not verified on block explorer.',
        detail: 'Cannot inspect what this contract actually does.',
    },
    {
        id: 'recent',
        type: 'recent_deployment',
        level: 'medium',
        title: 'Recently Deployed',
        description: 'Contract was deployed less than 30 days ago.',
        detail: 'New contracts may not have been audited or battle-tested.',
    },
    {
        id: 'proxy',
        type: 'proxy_contract',
        level: 'medium',
        title: 'Upgradeable Proxy',
        description: 'Contract uses upgradeable proxy pattern.',
        detail: 'The owner could change the logic at any time.',
    },
];
