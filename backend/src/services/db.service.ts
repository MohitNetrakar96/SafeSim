// Mock PrismaClient to bypass typescript/generation issues
export const prisma = {
  contract: {
    findUnique: async () => null,
    upsert: async () => null
  }
} as any;
