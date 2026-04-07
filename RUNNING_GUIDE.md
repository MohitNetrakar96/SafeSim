# 🚀 SafeSim Project - Running Guide

## Project Status

### ✅ Frontend (Running)
- **URL**: http://localhost:5173
- **Status**: Active (running for 5+ hours)
- **Framework**: React + Vite + TypeScript
- **Features**:
  - Modern UI with Framer Motion animations
  - Transaction simulator interface
  - Hero section and feature showcase
  - Design system components

### ✅ Backend (Starting)
- **URL**: http://localhost:3001
- **Status**: Starting up
- **Framework**: Node.js + Express + TypeScript
- **Features**:
  - Transaction decoding API
  - Simulation service (Alchemy SDK integration)
  - Risk assessment engine
  - Contract ABI fetching
  - Multi-layer caching (Redis + PostgreSQL)
  - Rate limiting (10 req/min per wallet)

---

## 📍 Available Endpoints

### Backend API Endpoints

#### 1. **Health Check**
```bash
GET http://localhost:3001/health
```

#### 2. **Decode Transaction**
```bash
POST http://localhost:3001/api/decode
Content-Type: application/json

{
  "contractAddress": "0x...",
  "network": "mainnet",
  "functionName": "transfer",
  "params": ["0x...", "1000000000000000000"]
}
```

#### 3. **Simulate Transaction**
```bash
POST http://localhost:3001/api/simulate
Content-Type: application/json

{
  "from": "0x...",
  "to": "0x...",
  "data": "0x...",
  "value": "0",
  "network": "mainnet"
}
```

#### 4. **Risk Assessment**
```bash
POST http://localhost:3001/api/assess-risk
Content-Type: application/json

{
  "contractAddress": "0x...",
  "functionName": "approve",
  "params": ["0x...", "115792089237316195423570985008687907853269984665640564039457584007913129639935"],
  "network": "mainnet",
  "from": "0x..."
}
```

---

## 🗄️ Database Setup (Optional)

The backend uses **PostgreSQL** for persistent storage and **Redis** for caching.

### Prerequisites

#### 1. PostgreSQL
Install and create a database:
```bash
# Create database
createdb safesim

# Set DATABASE_URL in backend/.env
DATABASE_URL="postgresql://user:password@localhost:5432/safesim"
```

#### 2. Redis
Install and start Redis:
```bash
# Windows (via WSL or Docker)
docker run -d -p 6379:6379 redis

# Or via WSL
redis-server
```

### Run Migrations
```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

---

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=3001

# API Keys
ETHERSCAN_API_KEY=your_etherscan_key
ALCHEMY_API_KEY=your_alchemy_key

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/safesim

# Redis
REDIS_URL=redis://localhost:6379
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
```

---

## 🧪 Testing the API

### Using cURL

**Test Health**
```bash
curl http://localhost:3001/health
```

**Decode Transaction**
```bash
curl -X POST http://localhost:3001/api/decode \
  -H "Content-Type: application/json" \
  -d '{
    "contractAddress": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    "network": "mainnet",
    "functionName": "transfer",
    "params": ["0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", "1000000000000000000"]
  }'
```

### Using the Frontend

1. Open http://localhost:5173
2. Navigate to the simulator section
3. Enter a contract address
4. Select a function
5. Input parameters
6. Click "Simulate Transaction"

---

## 📦 Smart Contracts (Hardhat)

### Compile Contracts
```bash
cd backend
npx hardhat compile
```

### Deploy to Testnet (Sepolia)
```bash
npx hardhat run scripts/deploy-all.ts --network sepolia
```

### Upgrade Contracts
```bash
npx hardhat run scripts/upgrade-contracts.ts --network sepolia
```

---

## 🐛 Troubleshooting

### Backend won't start
- **Check Dependencies**: Run `npm install` in backend folder
- **Check Ports**: Ensure port 3001 is not in use
- **Check .env**: Verify environment variables are set

### Frontend API calls fail
- **CORS**: Backend has CORS enabled for localhost
- **API URL**: Check `VITE_API_URL` in frontend/.env
- **Backend Running**: Ensure backend is active on port 3001

### Database errors
- **PostgreSQL**: Start PostgreSQL service
- **Migrations**: Run `npx prisma migrate dev`
- **Generate Client**: Run `npx prisma generate`

### Redis errors
- **Non-critical**: Backend will work without Redis (slower)
- **Start Redis**: Run `redis-server` or Docker container
- **Check Connection**: Verify `REDIS_URL` in .env

---

## 🎯 Next Steps

1. **Set up Database** (Optional but recommended)
   - Install PostgreSQL and Redis
   - Run Prisma migrations
   - Configure .env with connection strings

2. **Get API Keys**
   - Etherscan: https://etherscan.io/apis
   - Alchemy: https://www.alchemy.com/

3. **Deploy Contracts** (For on-chain analysis)
   - Compile Solidity contracts
   - Deploy to Sepolia testnet
   - Update backend to use deployed contracts

4. **Browser Extension** (Future)
   - Web3 wallet integration
   - Real-time transaction interception
   - One-click simulation before signing

---

## 📊 Project Structure

```
SomeNew/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── api/           # API client
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # Service layer
│   │   └── providers/     # React Query provider
│   └── package.json
│
└── backend/               # Node.js backend
    ├── src/
    │   ├── services/      # Business logic
    │   │   ├── contract.service.ts
    │   │   ├── decoder.service.ts
    │   │   ├── simulation.service.ts
    │   │   ├── risk.service.ts
    │   │   ├── cache.service.ts
    │   │   └── db.service.ts
    │   └── server.ts      # Express app
    ├── contracts/         # Solidity contracts
    │   ├── SimulationHelper.sol
    │   └── TokenAnalyzer.sol
    ├── scripts/           # Deployment scripts
    ├── prisma/            # Database schema
    └── package.json
```

---

## 🚦 Status Check

**Frontend**: ✅ Running on http://localhost:5173
**Backend**: 🟡 Starting on http://localhost:3001
**Database**: ⚪ Optional (not required for basic features)
**Redis**: ⚪ Optional (enables caching)

Visit **http://localhost:5173** to see the application! 🎉
