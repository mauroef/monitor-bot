import type { GridBotStatusResponse, GridBotGridResponse } from '../types'

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`/api/grid${path}`)
  if (!res.ok) throw new Error(`grid-bot ${path} → ${res.status}`)
  return res.json() as Promise<T>
}

async function post<T>(path: string): Promise<T> {
  const res = await fetch(`/api/grid${path}`, { method: 'POST' })
  if (!res.ok) throw new Error(`grid-bot ${path} → ${res.status}`)
  return res.json() as Promise<T>
}

export interface BotLogEntry {
  id: number
  ts: string
  level: 'INFO' | 'WARN' | 'ERROR' | 'TRADE' | 'GRID'
  message: string
  data: Record<string, unknown>
}

export const gridBotApi = {
  status: () => get<GridBotStatusResponse>('/status'),
  grid: () => get<GridBotGridResponse>('/grid'),
  health: () => get<{ status: string; ts: string }>('/health'),
  logs: () => get<BotLogEntry[]>('/logs'),
  reset: () => post<{ ok: boolean; message: string }>('/reset'),
}
