import { ethers } from 'ethers';

export interface RiskFactor {
    scoreImpact: number;
    description: string;
    category: 'contract' | 'transaction' | 'pattern';
    severity: 'low' | 'medium' | 'critical';
}

export interface RiskAssessment {
    score: number; // 0-100
    level: 'safe' | 'low' | 'medium' | 'high' | 'critical';
    factors: RiskFactor[];
}

const BLACKLISTED_ADDRESSES = new Set([
    '0x000000000000000000000000000000000000dead',
    // Add known malicious addresses here
]);

export class RiskService {

    async assessRisk(
        contractAddress: string,
        transactionData: any, // { functionName, params, value, data }
        simulationResult?: any // Optional: results from SimulationService
    ): Promise<RiskAssessment> {

        let score = 100;
        const factors: RiskFactor[] = [];

        // --- 1. Contract Analysis ---

        // Check if blacklisted
        if (BLACKLISTED_ADDRESSES.has(contractAddress.toLowerCase())) {
            this.addFactor(factors, -100, 'Contract is in database of known scams', 'pattern', 'critical');
        }

        // Verification (Mocked - normally requires Etherscan API check)
        // Assume unverified for demo/mock logic unless we persist verification state
        const isVerified = Math.random() > 0.4; // 60% chance verified
        if (isVerified) {
            this.addFactor(factors, 0, 'Contract source code is verified', 'contract', 'low'); // No bonus, just baseline
        } else {
            this.addFactor(factors, -20, 'Contract source code is NOT verified', 'contract', 'critical');
        }

        // Age / Activity (Mocked)
        const isNew = Math.random() > 0.8;
        if (isNew) {
            this.addFactor(factors, -15, 'Newly created contract (< 14 days)', 'contract', 'medium');
        }

        // Audit Reports (Mocked)
        const hasAudit = Math.random() > 0.9;
        if (hasAudit) {
            this.addFactor(factors, 10, 'Audited by reputable firm', 'contract', 'low');
        }

        // --- 2. Transaction Analysis ---

        const { functionName, params } = transactionData;

        // Infinite Approval
        if (functionName === 'approve' || functionName === 'increaseAllowance') {
            const amount = params?.amount || params?.value || params?._value;
            // Check for max uint256 or very large number
            if (amount && (amount.toString().includes('115792089237316195423570985008687907853269984665640564039457584007913129639935') || amount.length > 60)) {
                this.addFactor(factors, -30, 'Requesting UNLIMITED token approval', 'transaction', 'critical');
            }
        }

        // Transfer to new address
        if (functionName === 'transfer' || functionName === 'transferFrom') {
            // In real system, check 'to' address tx history
            const isFreshAddress = Math.random() > 0.9; // Mock
            if (isFreshAddress) {
                this.addFactor(factors, -10, 'Transferring funds to a fresh address with no history', 'transaction', 'medium');
            }
        }

        // Gas Usage (from Simulation)
        if (simulationResult) {
            if (simulationResult.success === false) {
                this.addFactor(factors, -50, `Transaction Reverts: ${simulationResult.error?.message}`, 'transaction', 'critical');
            }

            const gasUsed = parseInt(simulationResult.gasUsed || '0');
            if (gasUsed > 1000000) {
                this.addFactor(factors, -10, 'Extremely high gas usage (potential DoS/Loop)', 'transaction', 'medium');
            }
        }

        // --- 3. Pattern Matching ---

        // Honeypot indicators in simulation logs (e.g. transfer fails but no revert, or tax > 50%)
        if (simulationResult?.assetChanges) {
            // Mock check for high tax
            // If sending 100 and receiver gets < 80 => high tax
        }

        // --- Scoring Calculation ---
        // Apply all factors
        factors.forEach(f => score += f.scoreImpact);

        // Clamp
        score = Math.max(0, Math.min(100, score));

        // Determine Level
        let level: RiskAssessment['level'] = 'safe';
        if (score < 40) level = 'critical';
        else if (score < 60) level = 'high';
        else if (score < 80) level = 'medium';
        else if (score < 95) level = 'low';

        return {
            score,
            level,
            factors
        };
    }

    private addFactor(
        factors: RiskFactor[],
        impact: number,
        desc: string,
        cat: RiskFactor['category'],
        sev: RiskFactor['severity']
    ) {
        factors.push({
            scoreImpact: impact,
            description: desc,
            category: cat,
            severity: sev
        });
    }
}

export const riskService = new RiskService();
