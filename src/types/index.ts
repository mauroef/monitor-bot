export type BotType = 'grid' | 'trading'

export interface BotStatus {
  botId: string
  botType: BotType
  isActive: boolean
  status: string
  lastUpdate: string
  nextCycleAt?: string
  exchange: string
  testnet: boolean
}

export interface Balance {
  asset: string
  free: number
  locked: number
  total: number
}

export interface Order {
  id: string
  botType: BotType
  side: 'buy' | 'sell'
  price: number
  quantity: number
  status: 'open' | 'filled' | 'cancelled'
  createdAt: string
  stopLoss?: number
  takeProfit?: number
}

export interface BotMetrics {
  botType: BotType
  metrics: Record<string, number | string>
}

export interface DashboardData {
  bots: BotStatus[]
  balances: Balance[]
  openOrders: Order[]
  metrics: BotMetrics[]
}

// Raw response shapes from grid-bot
export interface GridBotStatusResponse {
  status: 'ACTIVE' | 'PAUSED' | 'STOPPED' | 'not_initialized'
  symbol: string
  profile: string
  exchange: string
  testnet: boolean
  generatedAt: string
  nextCycleAt: string
  performance: {
    totalCycles: number
    totalGrossPnl: number
    totalFees: number
    totalNetPnl: number
  }
  lastRegime: {
    regime: 'ranging' | 'trending'
    adx: number
    bbWidthPct: number
  }
}

export interface GridBotGridResponse {
  status: string
  symbol: string
  profile: string
  currentPrice: string | null
  generatedAt: string
  nextCycleAt: string
  cooldownUntil: string
  account: {
    freeBalance: string
    usdtInBuys: string
    baseInSells: string
    capitalDeployed: string
    totalPortfolio: string
  } | null
  grid: {
    lower: string
    upper: string
    levels: number
    spacing: string
    atrAtCreation: string
    createdAt: string
  } | null
  levels: {
    total: number
    open: number
    pending: number
    filled: number
    detail: Array<{
      index: number
      price: string
      side: 'BUY' | 'SELL'
      qty: string
      orderId: string
      placedAt: string
    }>
  } | null
  performance: {
    totalCycles: number
    totalGrossPnl: string
    totalFees: string
    totalNetPnl: string
    capitalDeployed: string
  }
  lastRegime: { regime: string; adx: number; bbWidthPct: number }
  lastRiskCheck: { action: string }
  recentCycles: Array<{
    id: string
    buyPrice: string
    sellPrice: string
    qty: string
    grossPnl: string
    completedAt: string
  }>
}

// Raw response shapes from trading-bot
export interface TradingBotStatusResponse {
  generatedAt: string
  nextCycleAt: string | null
  config: {
    exchange: string
    symbol: string
    interval: number
    strategy: string
    riskPercent: number
    capitalUsdt: number | null
    testnet: boolean
  }
  account: {
    balance: number
    lastAction: string | null
  }
  openPositions: Array<{
    id: string
    symbol: string
    side: string
    entryPrice: string
    qty: string
    notionalUsdt: string
    stopLoss: string
    takeProfit: string
    openedAt: string
    openDurationMin: number
  }>
  performance: {
    totalTrades: number
    winners: number
    losers: number
    winRate: string | null
    totalFees: string | null
    totalNetPnl: string | null
    avgNetPnl: string | null
    trades: { best: string; worst: string } | null
  }
  tradeHistory: Array<{
    id: string
    symbol: string
    side: string
    entryPrice: string
    closePrice: string | null
    qty: string
    openedAt: string
    closedAt: string
    pnl: { gross: string | null; fees: string | null; net: string | null }
  }>
}

export interface TradingBotBalanceResponse {
  symbol: string
  currentPrice: string
  usdtFree: string
  usdtLocked: string
  totalPortfolio: string
  openOrders: Array<{
    orderId: string
    side: string
    type: string
    price: string
    qty: string
    filled: string
    status: string
    placedAt: string
  }>
  // dynamic key: BTCFree, ETHFree, etc.
  [key: string]: unknown
}
