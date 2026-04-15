import type { SignalBotStatusResponse, SignalBotBalanceResponse } from '../types'

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`/api/signal${path}`)
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

export const signalBotApi = {
  status: () => get<SignalBotStatusResponse>('/status'),
  balance: () => get<SignalBotBalanceResponse>('/balance'),
  health: () => get<{ status: string; ts: string }>('/health'),
  logs: () => get<BotLogEntry[]>('/logs'),
  history: () => get<TradeHistoryEntry[]>('/history'),
}
