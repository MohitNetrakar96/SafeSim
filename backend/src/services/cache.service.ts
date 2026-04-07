import Redis from 'ioredis';

export class CacheService {
    private redis: Redis;

    constructor() {
        this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
            retryStrategy: (times) => Math.min(times * 50, 2000), // Retry with backoff
        });

        this.redis.on('error', (err) => console.error('Redis Cache Error:', err));
    }

    async get(key: string): Promise<string | null> {
        return this.redis.get(key);
    }

    async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
        if (ttlSeconds) {
            await this.redis.set(key, value, 'EX', ttlSeconds);
        } else {
            await this.redis.set(key, value);
        }
    }

    // Specialized helpers
    async getABI(address: string, network: string): Promise<any | null> {
        const key = `abi:${network.toLowerCase()}:${address.toLowerCase()}`;
        const cached = await this.get(key);
        return cached ? JSON.parse(cached) : null;
    }

    async setABI(address: string, network: string, abi: any): Promise<void> {
        const key = `abi:${network.toLowerCase()}:${address.toLowerCase()}`;
        await this.set(key, JSON.stringify(abi), 86400); // 24h
    }

    async getSimulationResult(inputsHash: string): Promise<any | null> {
        const key = `sim:${inputsHash}`;
        const cached = await this.get(key);
        return cached ? JSON.parse(cached) : null;
    }

    async setSimulationResult(inputsHash: string, result: any): Promise<void> {
        const key = `sim:${inputsHash}`;
        await this.set(key, JSON.stringify(result), 3600); // 1h
    }

    async checkRateLimit(identifier: string, limit: number = 10, windowSeconds: number = 60): Promise<{ isLimited: boolean; remaining: number }> {
        const key = `ratelimit:${identifier}`;
        const current = await this.redis.incr(key);

        if (current === 1) {
            await this.redis.expire(key, windowSeconds);
        }

        return {
            isLimited: current > limit,
            remaining: Math.max(0, limit - current)
        };
    }
}

export const cacheService = new CacheService();
