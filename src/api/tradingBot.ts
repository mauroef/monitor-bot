import type { TradingBotStatusResponse, TradingBotBalanceResponse } from '../types'

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`/api/trading${path}`)
  if (!res.ok) throw new Error(`trading-bot ${path} → ${res.status}`)
  return res.json() as Promise<T>
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
}
