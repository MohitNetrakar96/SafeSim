import { ethers, Interface } from 'ethers';
import axios from 'axios';
import { cacheService } from './cache.service';
import { prisma } from './db.service';

// Standard ERC20 ABI as fallback
const ERC20_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address owner) view returns (uint256)",
    "function transfer(address to, uint256 value) returns (bool)",
    "function approve(address spender, uint256 value) returns (bool)",
    "function transferFrom(address from, address to, uint256 value) returns (bool)",
    "event Transfer(address indexed from, address indexed to, uint256 value)",
    "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

export class ContractService {

    async getABI(address: string, network: string): Promise<any> {
        // 1. Check Redis Cache
        try {
            const cached = await cacheService.getABI(address, network);
            if (cached) {
                return cached;
            }
        } catch (error) {
            console.warn('Cache fetch failed:', error);
        }

        // 2. Check Database
        try {
            const dbContract = await prisma.contract.findUnique({
                where: {
                    address_network: {
                        address,
                        network
                    }
                }
            });
            if (dbContract?.abi) {
                await cacheService.setABI(address, network, dbContract.abi);
                return dbContract.abi;
            }
        } catch (error) {
            console.warn('Database fetch failed:', error);
        }

        // 3. Fetch from Etherscan API
        const apiKey = process.env.ETHERSCAN_API_KEY;
        let abi = ERC20_ABI;

        if (apiKey) {
            try {
                const url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${apiKey}`;
                const response = await axios.get(url);
                if (response.data.status === '1') {
                    abi = JSON.parse(response.data.result);
                } else {
                    console.warn(`Etherscan API error for ${address}:`, response.data.message);
                }
            } catch (error) {
                console.warn('Failed to fetch ABI from Etherscan, using fallback');
            }
        }

        // 4. Update Cache and Database
        try {
            await cacheService.setABI(address, network, abi);

            await prisma.contract.upsert({
                where: {
                    address_network: {
                        address,
                        network
                    }
                },
                update: {
                    abi: abi || JSON.stringify([]),
                    lastUpdated: new Date()
                },
                create: {
                    address,
                    network,
                    abi: abi || JSON.stringify([]),
                    name: 'Unknown Contract'
                }
            });
        } catch (error) {
            console.error('Failed to update cache/db:', error);
        }

        return abi;
    }

    // Analyze ABI for functions and events (helper for other services)
    analyzeContract(abi: any) {
        const iface = new Interface(abi);
        const functions: any[] = [];
        const events: any[] = [];
        const types: Record<string, string> = {};

        iface.forEachFunction((fragment) => {
            functions.push({
                name: fragment.name,
                inputs: fragment.inputs.map(i => ({ name: i.name, type: i.type })),
                outputs: fragment.outputs.map(o => ({ type: o.type })),
                stateMutability: fragment.stateMutability
            });
            types[fragment.name] = fragment.stateMutability;
        });

        iface.forEachEvent((fragment) => {
            events.push({
                name: fragment.name,
                inputs: fragment.inputs.map(i => ({ name: i.name, type: i.type, indexed: i.indexed }))
            });
        });

        return { functions, events, types };
    }
}

export const contractService = new ContractService(); // Export single instance
