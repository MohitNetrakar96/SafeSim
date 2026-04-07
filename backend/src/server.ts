import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { ContractService } from './services/contract.service';
import { DecoderService } from './services/decoder.service';
import { SimulationService } from './services/simulation.service';
import { RiskService } from './services/risk.service';
import { cacheService } from './services/cache.service';
import paymentRoutes from './routes/payment';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const contractService = new ContractService();

const decoderService = new DecoderService();
const simulationService = new SimulationService();
const riskService = new RiskService();

// Rate limiting middleware
const rateLimit = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const wallet = req.body.from || req.body.userAddress;
    if (wallet) {
        const { isLimited, remaining } = await cacheService.checkRateLimit(wallet, 10, 60);
        res.setHeader('X-RateLimit-Limit', '10');
        res.setHeader('X-RateLimit-Remaining', remaining.toString());
        if (isLimited) {
            res.status(429).json({ error: 'Rate limit exceeded' });
            return;
        }
    }
    next();
};

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend server is running!' });
});

// Payment routes
app.use('/api/payment', paymentRoutes);

app.use('/api/simulate', rateLimit);
app.use('/api/assess-risk', rateLimit);

app.post('/api/decode', async (req, res) => {
    try {
        const { contractAddress, network, functionName, params } = req.body;

        if (!contractAddress || !functionName) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // 1. Fetch ABI
        const abi = await contractService.getABI(contractAddress, network);

        // 2. Analyze Contract (optional, store for later)
        // const analysis = contractService.analyzeContract(abi);

        // 3. Decode & Simulate
        const result = await decoderService.decodeTransaction(
            contractAddress,
            network,
            functionName,
            params,
            abi
        );

        res.json(result);
    } catch (error: any) {
        console.error('Error decoding transaction:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

app.post('/api/simulate', async (req, res) => {
    try {
        const { from, to, value, data, network } = req.body;

        if (!from || !to) {
            return res.status(400).json({ error: 'Missing required fields: from, to' });
        }

        const result = await simulationService.simulateTransaction({
            from,
            to,
            value,
            data,
            network
        });

        res.json(result);
    } catch (error: any) {
        console.error('Error simulating transaction:', error);
        res.status(500).json({ error: error.message || 'Simulation failed' });
    }

});

app.post('/api/assess-risk', async (req, res) => {
    try {
        const { contractAddress, functionName, params, value, data, network, from } = req.body;

        // 1. Run Simulation (optional but recommended for risk)
        let simResult;
        try {
            simResult = await simulationService.simulateTransaction({
                from: from || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
                to: contractAddress,
                value,
                data,
                network
            });
        } catch (e) {
            console.warn('Simulation failed during risk assessment:', e);
            simResult = { success: false, error: { message: 'Simulation failed' }, gasUsed: '0' };
        }

        // 2. Assess Risk
        const risk = await riskService.assessRisk(
            contractAddress,
            { functionName, params, value, data },
            simResult
        );

        res.json({
            risk,
            simulation: simResult
        });
    } catch (error: any) {
        console.error('Error assessing risk:', error);
        res.status(500).json({ error: error.message || 'Risk assessment failed' });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
    console.log(`Backend server running on port ${port}`);
});
