import { useQuery } from '@tanstack/react-query'
import { gridBotApi } from '../api/gridBot'
import { tradingBotApi } from '../api/tradingBot'
import type { BotLogEntry as GridLogEntry } from '../api/gridBot'
import type { BotLogEntry as TradingLogEntry } from '../api/tradingBot'

// Messages to suppress in the trading-bot log
const TRADING_SKIP = ['Waiting for next cycle']

export type { GridLogEntry, TradingLogEntry }

const LEVEL_COLOR: Record<string, string> = {
  INFO:  'text-cyan-400',
  WARN:  'text-yellow-400',
  ERROR: 'text-red-400',
  TRADE: 'text-fuchsia-400',
  GRID:  'text-blue-400',
}

export function levelColor(level: string): string {
  return LEVEL_COLOR[level] ?? 'text-zinc-400'
}

export function useGridLogs() {
  return useQuery({
    queryKey: ['grid', 'logs'],
    queryFn: gridBotApi.logs,
    staleTime: 10_000,
  })
}

export function useTradingLogs() {
  const { data, ...rest } = useQuery({
    queryKey: ['trading', 'logs'],
    queryFn: tradingBotApi.logs,
    staleTime: 10_000,
  })

  const filtered = data?.filter((e: TradingLogEntry) =>
    !TRADING_SKIP.some((skip) => e.message.includes(skip))
  )

  return { data: filtered, ...rest }
}

export function formatLogData(data: Record<string, unknown>): string {
  return Object.entries(data)
    .map(([k, v]) => `${k}=${v}`)
    .join('  ')
}
