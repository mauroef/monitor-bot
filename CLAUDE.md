# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

This project has no implementation yet. Start from scratch using:
- Vite + React + TypeScript: `npm create vite@latest . -- --template react-ts`
- Tailwind CSS: `npm install -D tailwindcss @tailwindcss/vite`
- TanStack Query: `npm install @tanstack/react-query`

## Commands

```bash
npm run dev        # Start dev server
npm run build      # Build for production (runs tsc then vite build)
npm run lint       # Lint
npm run preview    # Preview production build
```

## Architecture

Feature-based structure under `src/`:

```
src/
  api/
    gridBot.ts       # Fetchers for grid-bot endpoints
    tradingBot.ts    # Fetchers for trading-bot endpoints
    adapters.ts      # Normalize raw responses → shared types
  hooks/
    useDashboard.ts  # Composes both APIs into DashboardData
  types/
    index.ts         # All shared interfaces (BotStatus, Balance, Order, BotMetrics, DashboardData)
  components/
    layout/          # Dashboard shell
    bots/            # BotStatusCard
    balances/        # BalanceWidget
    orders/          # OrdersTable
    metrics/         # MetricsPanel
    ui/              # Card, Badge, Skeleton (primitives)
  App.tsx
  main.tsx
```

**Layer rule:** `api/` has no React imports. `hooks/` calls `api/` and wraps with `useQuery`. Components only consume hooks.

## Backend API Contracts

Both backends serve JSON over HTTP. Configure via:
```
VITE_GRID_BOT_API_URL=http://localhost:3000
VITE_TRADING_BOT_API_URL=http://localhost:3001
```

### grid-bot endpoints (`../grid-bot`)

**`GET /health`** → `{ status: "ok", ts: string }`

**`GET /status`** → compact summary:
```ts
{
  status: "ACTIVE" | "PAUSED" | "STOPPED" | "not_initialized"
  symbol: string
  profile: "conservative" | "moderate" | "aggressive"
  generatedAt: string
  nextCycleAt: string
  performance: { totalCycles: number, totalGrossPnl: number, totalFees: number, totalNetPnl: number }
  lastRegime: { regime: "ranging" | "trending", adx: number, bbWidthPct: number }
}
```

**`GET /grid`** → full state with account, levels, and recent cycles:
```ts
{
  status, symbol, profile, generatedAt, nextCycleAt, cooldownUntil,
  account: { freeBalance, usdtInBuys, btcInSells, capitalDeployed, totalPortfolio },
  grid: { lower, upper, levels, spacing, atrAtCreation, createdAt },
  levels: { total, open, pending, filled, detail: [{ index, price, side, qty, orderId, placedAt }] },
  performance: { totalCycles, totalGrossPnl, totalFees, totalNetPnl, capitalDeployed },
  lastRegime, lastRiskCheck,
  recentCycles: [{ id, buyPrice, sellPrice, qty, grossPnl, completedAt }]
}
```
Note: all monetary values are formatted strings like `"85000 USDT"` — parse with `parseFloat()`.

### trading-bot endpoints (`../trading-bot`)

**`GET /health`** → `{ status: "ok", ts: string }`

**`GET /status`** → summary with positions and trade history:
```ts
{
  generatedAt, nextCycleAt,
  config: { exchange, symbol, interval, strategy, riskPercent, capitalUsdt, testnet },
  account: { balance: number, lastAction: string | null },
  openPositions: [{ id, symbol, side, entryPrice, qty, notionalUsdt, stopLoss, takeProfit, openedAt, openDurationMin }],
  performance: { totalTrades, winners, losers, winRate, totalFees, totalNetPnl, avgNetPnl, trades },
  tradeHistory: [{ id, symbol, side, entryPrice, closePrice, qty, openedAt, closedAt, pnl: { gross, fees, net } }]
}
```

**`GET /balance`** → live account details fetched directly from the exchange (can fail if exchange is unreachable):
```ts
{
  symbol, currentPrice, usdtFree, usdtLocked, BTCFree, BTCLocked, totalPortfolio,
  openOrders: [{ orderId, side, type, price, qty, filled, status, placedAt }]
}
```

## Adapter Layer

Both backends return monetary values as formatted strings (`"500.00 USDT"`, `"0.00100 BTC"`). The adapter in `api/adapters.ts` must parse these before building the shared `DashboardData` type. The `/balance` endpoint on trading-bot makes live exchange calls — treat it as a separate query with a longer stale time (~60s).

## Shared Types (`src/types/index.ts`)

```ts
type BotType = 'grid' | 'trading'

interface BotStatus {
  botId: string
  botType: BotType
  isActive: boolean
  status: string       // ACTIVE | PAUSED | STOPPED for grid; inferred for trading
  lastUpdate: string
}

interface Balance {
  asset: 'BTC' | 'USDT'
  free: number
  locked: number
  total: number
}

interface Order {
  id: string
  botType: BotType
  side: 'buy' | 'sell'
  price: number
  quantity: number
  status: 'open' | 'filled' | 'cancelled'
  createdAt: string
}

interface BotMetrics {
  botType: BotType
  metrics: Record<string, number | string>
}

interface DashboardData {
  bots: BotStatus[]
  balances: Balance[]
  openOrders: Order[]
  metrics: BotMetrics[]
}
```

## Design System

- Tailwind only — no CSS-in-JS, no component libraries
- Color semantics: green = profit/active, red = loss/risk/stopped, yellow = warning/paused/pending
- Dark mode via Tailwind `dark:` classes
- Skeleton loaders (`animate-pulse`) while loading
- Mobile-first responsive layout

## Data Fetching

- Use `@tanstack/react-query` with `useQuery`
- Poll every 30s: `refetchInterval: 30_000`
- Handle partial failures: if one bot's API is down, show the other's data with an error badge
