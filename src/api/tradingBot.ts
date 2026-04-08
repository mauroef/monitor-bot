import type { TradingBotStatusResponse, TradingBotBalanceResponse } from '../types'

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`/api/trading${path}`)
  if (!res.ok) throw new Error(`signal-bot ${path} → ${res.status}`)
  return res.json() as Promise<T>
}

export interface TradeHistoryEntry {
  id: string
  symbol: string
  side: string
  entryPrice: string
  closePrice: string | null
  qty: string
  notionalUsdt: string
  balanceBeforeTrade: string | null
  openedAt: string
  closedAt: string
  pnl: {
    gross: string | null
    fees: string | null
    net: string | null
  }
}

export interface BotLogEntry {
  id: number
  ts: string
  level: 'INFO' | 'WARN' | 'ERROR' | 'TRADE'
  message: string
  data: Record<string, unknown>
}

export const tradingBotApi = {
  status: () => get<TradingBotStatusResponse>('/status'),
  balance: () => get<TradingBotBalanceResponse>('/balance'),
  health: () => get<{ status: string; ts: string }>('/health'),
  logs: () => get<BotLogEntry[]>('/logs'),
  history: () => get<TradeHistoryEntry[]>('/history'),
}
