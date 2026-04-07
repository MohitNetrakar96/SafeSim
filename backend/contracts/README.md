# Smart Contracts for SafeSim

## Overview

This directory contains Solidity smart contracts for advanced blockchain simulation and token analysis, deployed using the UUPS (Universal Upgradeable Proxy Standard) pattern.

## Contracts

### 1. SimulationHelper.sol
A versatile contract for simulating and testing contract interactions on-chain.

**Features:**
- ✅ Simulate any contract call and capture results
- ✅ Measure gas consumption accurately
- ✅ Batch simulate multiple calls
- ✅ Capture events emitted during simulations
- ✅ UUPS upgradeable pattern

**Key Functions:**
```solidity
function simulateCall(address target, bytes calldata data, uint256 value)
function batchSimulate(address[] calldata targets, bytes[] calldata calldatas, uint256[] calldata values)
function measureGas(address target, bytes calldata data)
```

### 2. TokenAnalyzer.sol
Analyze ERC20 tokens for security risks and hidden behaviors.

**Features:**
- ✅ Detect hidden minting functions
- ✅ Identify transfer fees/taxes
- ✅ Check for proxy patterns
- ✅ Honeypot detection
- ✅ Batch analysis support
- ✅ UUPS upgradeable pattern

**Key Functions:**
```solidity
function analyzeToken(address tokenAddress) returns (TokenAnalysis memory)
function checkHiddenMint(address tokenAddress) returns (bool)
function checkTransferFee(address tokenAddress) returns (bool)
function checkHoneypot(address tokenAddress) returns (bool)
function batchAnalyze(address[] calldata tokens) returns (TokenAnalysis[] memory)
```

## Setup

### Install Dependencies
```bash
npm install
```

### Environment Variables
Create a `.env` file in the backend directory:
```env
# Private key for deployment (NEVER commit this!)
PRIVATE_KEY=your_private_key_here

# RPC URLs
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
MUMBAI_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_KEY

# Etherscan API keys for verification
ETHERSCAN_API_KEY=your_etherscan_key
POLYGONSCAN_API_KEY=your_polygonscan_key
```

## Deployment

### Compile Contracts
```bash
npx hardhat compile
```

### Deploy to Local Hardhat Network (Testing)
```bash
npx hardhat run scripts/deploy-all.ts --network hardhat
```

### Deploy to Sepolia Testnet
```bash
npx hardhat run scripts/deploy-all.ts --network sepolia
```

### Deploy to Mumbai Testnet (Polygon)
```bash
npx hardhat run scripts/deploy-all.ts --network mumbai
```

### Deploy Individual Contracts
```bash
# SimulationHelper only
npx hardhat run scripts/deploy-simulation-helper.ts --network sepolia

# TokenAnalyzer only
npx hardhat run scripts/deploy-token-analyzer.ts --network sepolia
```

## Upgrading Contracts

Since both contracts use the UUPS pattern, they can be upgraded without changing the proxy address:

```bash
# Upgrade both contracts
npx hardhat run scripts/upgrade-contracts.ts --network sepolia
```

**Important:** Only the contract owner can upgrade. The owner is set during initialization.

## Verify on Etherscan

After deployment, verify the contracts:

```bash
npx hardhat verify --network sepolia PROXY_ADDRESS
npx hardhat verify --network sepolia IMPLEMENTATION_ADDRESS
```

## Testing

Run the test suite:
```bash
npx hardhat test
```

Run with gas reporting:
```bash
REPORT_GAS=true npx hardhat test
```

## Security Considerations

1. **UUPS Pattern**: These contracts use UUPS (ERC-1822) for upgradeability
2. **Access Control**: Only the owner can upgrade contracts
3. **Initialization**: Contracts use `initializer` modifier to prevent re-initialization
4. **Static Analysis**: Token analysis functions use `staticcall` to avoid state changes

## Integration with Backend

The backend API can interact with these deployed contracts:

```typescript
import { ethers } from 'ethers';

// Connect to deployed SimulationHelper
const simulationHelper = new ethers.Contract(
  SIMULATION_HELPER_ADDRESS,
  SimulationHelperABI,
  provider
);

// Simulate a transaction
const result = await simulationHelper.simulateCall(
  targetContract,
  calldata,
  value
);
```

## Architecture

```
┌─────────────────────┐
│   Proxy Contract    │  ← User interacts here (fixed address)
│   (ERC1967Proxy)    │
└──────────┬──────────┘
           │ delegatecall
           ▼
┌─────────────────────┐
│  Implementation     │  ← Can be upgraded
│  SimulationHelper/  │
│  TokenAnalyzer      │
└─────────────────────┘
```

## Deployed Addresses

Deployment addresses are automatically saved to `deployment-info.json` after deployment.

## License

MIT
