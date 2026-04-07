// Types for the Simulator Interface

export interface Network {
    id: string;
    name: string;
    icon: string;
    chainId: number;
    color: string;
}

export const NETWORKS: Network[] = [
    { id: 'ethereum', name: 'Ethereum', icon: '⟠', chainId: 1, color: 'from-blue-400 to-indigo-500' },
    { id: 'polygon', name: 'Polygon', icon: '⬡', chainId: 137, color: 'from-purple-400 to-violet-500' },
    { id: 'arbitrum', name: 'Arbitrum', icon: '🔵', chainId: 42161, color: 'from-sky-400 to-blue-500' },
    { id: 'base', name: 'Base', icon: '🔷', chainId: 8453, color: 'from-blue-500 to-cyan-400' },
];

export type SolidityType = 'address' | 'uint256' | 'int256' | 'bool' | 'string' | 'bytes' | 'bytes32' | 'uint8' | 'uint128';

export interface FunctionParam {
    name: string;
    type: SolidityType;
    description?: string;
}

export type StateMutability = 'view' | 'pure' | 'nonpayable' | 'payable';

export interface ContractFunction {
    name: string;
    params: FunctionParam[];
    stateMutability: StateMutability;
    outputs?: string[];
}

// Mock data for demo
export const MOCK_FUNCTIONS: ContractFunction[] = [
    {
        name: 'transfer',
        params: [
            { name: 'to', type: 'address', description: 'Recipient wallet address' },
            { name: 'amount', type: 'uint256', description: 'Amount of tokens (in wei)' },
        ],
        stateMutability: 'nonpayable',
    },
    {
        name: 'approve',
        params: [
            { name: 'spender', type: 'address', description: 'Address allowed to spend tokens' },
            { name: 'amount', type: 'uint256', description: 'Max amount to approve (in wei)' },
        ],
        stateMutability: 'nonpayable',
    },
    {
        name: 'balanceOf',
        params: [
            { name: 'account', type: 'address', description: 'Address to check balance of' },
        ],
        stateMutability: 'view',
        outputs: ['uint256'],
    },
    {
        name: 'totalSupply',
        params: [],
        stateMutability: 'view',
        outputs: ['uint256'],
    },
    {
        name: 'allowance',
        params: [
            { name: 'owner', type: 'address', description: 'Token owner address' },
            { name: 'spender', type: 'address', description: 'Spender address' },
        ],
        stateMutability: 'view',
        outputs: ['uint256'],
    },
    {
        name: 'mint',
        params: [
            { name: 'to', type: 'address', description: 'Recipient of minted tokens' },
            { name: 'amount', type: 'uint256', description: 'Amount to mint' },
        ],
        stateMutability: 'payable',
    },
    {
        name: 'setApprovalForAll',
        params: [
            { name: 'operator', type: 'address', description: 'Operator to set approval for' },
            { name: 'approved', type: 'bool', description: 'Whether to approve or revoke' },
        ],
        stateMutability: 'nonpayable',
    },
    {
        name: 'name',
        params: [],
        stateMutability: 'pure',
        outputs: ['string'],
    },
];

export const TYPE_HELP: Record<SolidityType, string> = {
    address: '0x-prefixed Ethereum address (42 characters)',
    uint256: 'Unsigned integer (0 to 2²⁵⁶ - 1). Token amounts are usually in wei.',
    int256: 'Signed integer (-2²⁵⁵ to 2²⁵⁵ - 1)',
    bool: 'Boolean value: true or false',
    string: 'UTF-8 encoded text string',
    bytes: 'Dynamic-length byte array (0x-prefixed hex)',
    bytes32: 'Fixed-length 32 bytes (0x-prefixed, 66 chars)',
    uint8: 'Unsigned integer (0 to 255)',
    uint128: 'Unsigned integer (0 to 2¹²⁸ - 1)',
};

export const TYPE_PLACEHOLDER: Record<SolidityType, string> = {
    address: '0x1234...abcd',
    uint256: '1000000000000000000',
    int256: '-100',
    bool: 'true',
    string: 'Hello World',
    bytes: '0x',
    bytes32: '0x0000000000000000000000000000000000000000000000000000000000000000',
    uint8: '255',
    uint128: '1000000',
};
