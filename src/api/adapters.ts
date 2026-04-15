import type {
  GridBotStatusResponse,
  GridBotGridResponse,
  SignalBotStatusResponse,
  BotStatus,
  Balance,
  Order,
  BotMetrics,
} from '../types'
import { getQuoteAsset, getBaseAsset } from '../utils/format'

/** Parse "85000 USDT" or "0.00100 BTC" → number */
function parseAmount(value: string | number | null | undefined): number {
  if (value == null) return 0
  if (typeof value === 'number') return value
  return parseFloat(value) || 0
}

export function adaptGridBotStatus(raw: GridBotStatusResponse): BotStatus {
  return {
    botId: 'grid',
    botType: 'grid',
    isActive: raw.status === 'ACTIVE',
    status: raw.status,
    lastUpdate: raw.generatedAt,
    nextCycleAt: raw.nextCycleAt,
    exchange: raw.exchange ?? 'binance',
    testnet: raw.testnet ?? true,
  }
}

export function adaptGridBotBalances(raw: GridBotGridResponse): Balance[] {
  if (!raw.account) return []

  const freeUsdt = parseAmount(raw.account.freeBalance)
  const lockedUsdt = parseAmount(raw.account.usdtInBuys)
  const symbol = raw.symbol ?? ''
  const quoteAsset = getQuoteAsset(symbol)
  const baseAsset = getBaseAsset(symbol) || 'BASE'
  const baseInSells = parseAmount(raw.account.baseInSells)

  return [
    {
      asset: quoteAsset,
      free: freeUsdt,
      locked: lockedUsdt,
      total: freeUsdt + lockedUsdt,
    },
    {
      asset: baseAsset,
      free: 0,
      locked: baseInSells,
      total: baseInSells,
    },
  ]
}

export function adaptGridBotOrders(raw: GridBotGridResponse): Order[] {
  if (!raw.levels?.detail) return []
  return raw.levels.detail.map((l) => ({
    id: l.orderId,
    botType: 'grid' as const,
    side: l.side === 'BUY' ? 'buy' : 'sell',
    price: parseAmount(l.price),
    quantity: parseAmount(l.qty),
    status: 'open' as const,
    createdAt: l.placedAt,
  }))
}

export function adaptGridBotMetrics(
  status: GridBotStatusResponse,
  grid: GridBotGridResponse,
): BotMetrics {
  return {
    botType: 'grid',
    metrics: {
      totalCycles: status.performance?.totalCycles ?? 0,
      totalNetPnl: status.performance?.totalNetPnl ?? 0,
      totalFees: status.performance?.totalFees ?? 0,
      regime: status.lastRegime?.regime ?? 'unknown',
      adx: status.lastRegime?.adx ?? 0,
      profile: status.profile ?? '—',
      gridLower: parseAmount(grid.grid?.lower),
      gridUpper: parseAmount(grid.grid?.upper),
      openLevels: grid.levels?.open ?? 0,
    },
  }
}

export function adaptSignalBotStatus(raw: SignalBotStatusResponse): BotStatus {
  const isActive = (raw.openPositions?.length ?? 0) > 0 || raw.account.lastAction === 'BUY'
  return {
    botId: 'signal',
    botType: 'signal',
    isActive,
    status: isActive ? 'ACTIVE' : 'IDLE',
    lastUpdate: raw.generatedAt,
    nextCycleAt: raw.nextCycleAt ?? undefined,
    exchange: raw.config?.exchange ?? 'bybit',
    testnet: raw.config?.testnet ?? true,
  }
}

export function adaptSignalBotBalances(raw: SignalBotStatusResponse): Balance[] {
  return [
    {
      asset: 'USDT',
      free: raw.account.balance,
      locked: 0,
      total: raw.account.balance,
    },
  ]
}

export function adaptSignalBotOrders(raw: SignalBotStatusResponse): Order[] {
  return raw.openPositions.map((p) => ({
    id: p.id,
    botType: 'signal' as const,
    side: p.side.toLowerCase() as 'buy' | 'sell',
    price: parseAmount(p.entryPrice),
    quantity: parseAmount(p.qty),
    status: 'open' as const,
    createdAt: p.openedAt,
    stopLoss: parseAmount(p.stopLoss) || undefined,
    takeProfit: parseAmount(p.takeProfit) || undefined,
  }))
}

export function adaptSignalBotMetrics(raw: SignalBotStatusResponse): BotMetrics {
  return {
    botType: 'signal',
    metrics: {
      totalTrades: raw.performance.totalTrades,
      winners: raw.performance.winners,
      losers: raw.performance.losers,
      winRate: raw.performance.winRate ?? 'N/A',
      totalNetPnl: raw.performance.totalNetPnl ?? 'N/A',
      strategy: raw.config.strategy,
      exchange: raw.config.exchange,
    },
  }
}
