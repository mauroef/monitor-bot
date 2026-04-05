import type { GridBotStatusResponse, GridBotGridResponse } from '../types'

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`/api/grid${path}`)
  if (!res.ok) throw new Error(`grid-bot ${path} → ${res.status}`)
  return res.json() as Promise<T>
}

export const gridBotApi = {
  status: () => get<GridBotStatusResponse>('/status'),
  grid: () => get<GridBotGridResponse>('/grid'),
  health: () => get<{ status: string; ts: string }>('/health'),
}
