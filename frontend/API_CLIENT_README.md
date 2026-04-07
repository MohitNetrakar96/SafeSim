# API Client & Service Layer

This directory contains the API client infrastructure for communicating with the backend simulation service.

## Architecture

### 1. **API Client** (`api/client.ts`)
Base HTTP client built on Axios with:
- Automatic request/response interceptors
- Centralized error handling
- Authentication token management
- Request/response logging

### 2. **Service Layer** (`services/`)

#### **SimulationService** (`services/simulationService.ts`)
Handles all transaction simulation and risk assessment:

```typescript
// Decode transaction before signing
const decoded = await simulationService.decodeTransaction({
  contractAddress: '0x...',
  network: 'mainnet',
  functionName: 'transfer',
  params: [recipient, amount]
});

// Simulate transaction execution
const result = await simulationService.simulateTransaction({
  from: userAddress,
  to: contractAddress,
  value: '0',
  data: encodedData,
  network: 'mainnet'
});

// Get comprehensive risk assessment
const assessment = await simulationService.getRiskScore(
  contractAddress,
  'approve',
  [spender, amount],
  undefined,
  undefined,
  'mainnet',
  userAddress
);
```

### 3. **React Query Integration** (`providers/QueryProvider.tsx`)

Configured with:
- **Exponential backoff**: 1s → 2s → 4s retry delays
- **Smart retry logic**: Skip retry on 4xx errors
- **Caching**: 5min stale time, 10min cache time
- **Optimistic updates**: Instant UI feedback

Usage in components:

```typescript
import { useSimulateTransaction, useRiskAssessment } from '../hooks/useSimulation';

function MyComponent() {
  const { mutate: simulate, isLoading, error } = useSimulateTransaction();
  
  const handleSimulate = () => {
    simulate({
      from: address,
      to: contract,
      data: calldata
    }, {
      onSuccess: (result) => {
        console.log('Simulation success:', result);
      },
      onError: (error) => {
        console.error('Simulation failed:', error);
      }
    });
  };
}
```

### 4. **WebSocket Support** (`hooks/useWebSocket.ts`)

Real-time simulation progress updates:

```typescript
import { useWebSocket } from '../hooks/useWebSocket';

const { isConnected, send } = useWebSocket('ws://localhost:3001/simulation', {
  onMessage: (msg) => {
    if (msg.type === 'progress') {
      setProgress(msg.data.progress);
    }
  },
  reconnect: true,
  reconnectAttempts: 5
});
```

### 5. **Loading States** (`components/Skeleton.tsx`)

Animated skeleton loaders:

```tsx
import { Skeleton } from '../components/Skeleton';

{isLoading ? (
  <Skeleton variant="card" />
) : (
  <ActualContent data={data} />
)}
```

### 6. **Error Handling** (`components/ErrorBoundary.tsx`)

React error boundary with user-friendly fallback UI:

```tsx
import { ErrorBoundary } from '../components/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

## Environment Variables

Create `.env` in frontend root:

```env
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
```

## Best Practices

### 1. **Always use React Query hooks**
```typescript
// ✅ Good
const { data, isLoading, error } = useContractInfo(address, network);

// ❌ Bad - direct service calls in components
const data = await simulationService.getContractInfo(address, network);
```

### 2. **Handle loading and error states**
```tsx
if (isLoading) return <Skeleton variant="card" />;
if (error) return <ErrorMessage error={error} />;
return <YourContent data={data} />;
```

### 3. **Use optimistic updates for mutations**
```typescript
const { mutate } = useMutation({
  mutationFn: simulationService.simulateTransaction,
  onMutate: async (newData) => {
    // Optimistically update UI
    await queryClient.cancelQueries(['simulations']);
    const previous = queryClient.getQueryData(['simulations']);
    queryClient.setQueryData(['simulations'], [...previous, newData]);
    return { previous };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(['simulations'], context.previous);
  }
});
```

## Type Safety

All API responses are fully typed:

```typescript
interface SimulationResponse {
  success: boolean;
  gasUsed: string;
  logs: any[];
  traces: any[];
  error?: {
    message: string;
    reason?: string;
  };
}
```

TypeScript will catch errors at compile time, ensuring safe API interactions.

## Rate Limiting

Backend implements rate limiting (10 req/min per wallet):
- Rate limit headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`
- 429 response when exceeded
- Frontend should show user-friendly message

## Testing

Mock API calls in tests:

```typescript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.post('/api/simulate', (req, res, ctx) => {
    return res(ctx.json({ success: true, gasUsed: '21000' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```
