import { ethers, Interface } from 'ethers';

export class DecoderService {

    async decodeTransaction(
        contractAddress: string,
        network: string,
        functionName: string,
        params: Record<string, string>,
        abi: any
    ) {
        const iface = new Interface(abi);
        const fragment = iface.getFunction(functionName);

        if (!fragment) {
            throw new Error(`Function ${functionName} not found in ABI`);
        }

        // Validate params against ABI inputs
        const inputValues = fragment.inputs.map(input => {
            const val = params[input.name];
            if (val === undefined) throw new Error(`Missing parameter: ${input.name}`);
            return val;
        });

        // Create Natural Language Description
        let description = `Execute ${functionName} on ${contractAddress}`;

        // Heuristics for common functions
        if (functionName === 'transfer') {
            const to = params['to'] || params['_to'] || inputValues[0];
            const amount = params['value'] || params['amount'] || inputValues[1];
            description = `Transfer ${amount} tokens to ${to}`;
        } else if (functionName === 'approve') {
            const spender = params['spender'] || inputValues[0];
            const amount = params['value'] || params['amount'] || inputValues[1];
            description = `Approve ${spender} to spend ${amount} tokens`;
        } else if (functionName === 'swap') {
            description = `Swap tokens via contract`;
        }

        // Mock Gas Estimation (would require RPC provider call usually)
        const gasEstimate = "45000"; // Mock value

        // Mock State Changes (would require simulation/tracing)
        const stateChanges = [
            { type: 'Balance', target: 'You', before: '1000', after: '900', token: 'USDC' },
            { type: 'Approval', target: contractAddress, value: 'Infinite' }
        ];

        // Mock Risks
        const risks = [];
        if (functionName === 'approve' && (params['value']?.includes('11579') || params['amount']?.includes('11579'))) {
            risks.push('Unlimited Approval granted to contract');
        }

        return {
            decodedDescription: description,
            stateChanges,
            risks,
            gasEstimate
        };
    }
}

export const decoderService = new DecoderService();
