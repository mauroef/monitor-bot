import { useQuery } from '@tanstack/react-query'
import { gridBotApi } from '../api/gridBot'
import { signalBotApi } from '../api/signalBot'
import type { BotLogEntry as GridLogEntry } from '../api/gridBot'
import type { BotLogEntry as SignalLogEntry } from '../api/signalBot'

// Messages to suppress in the grid-bot log
const GRID_SKIP = ['Waiting for next cycle']

// Messages to suppress in the signal-bot log
const SIGNAL_SKIP = ['Waiting for next cycle']

export type { GridLogEntry, SignalLogEntry }

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
  const { data, ...rest } = useQuery({
    queryKey: ['grid', 'logs'],
    queryFn: gridBotApi.logs,
    staleTime: 10_000,
  })

  const filtered = data?.filter((e: GridLogEntry) =>
    !GRID_SKIP.some((skip) => e.message.includes(skip))
  )

  return { data: filtered, ...rest }
}

export function useSignalLogs() {
  const { data, ...rest } = useQuery({
    queryKey: ['signal', 'logs'],
    queryFn: signalBotApi.logs,
    staleTime: 10_000,
  })

  const filtered = data?.filter((e: SignalLogEntry) =>
    !SIGNAL_SKIP.some((skip) => e.message.includes(skip))
  )

  return { data: filtered, ...rest }
}

export function formatLogData(data: Record<string, unknown>): string {
  return Object.entries(data)
    .map(([k, v]) => `${k}=${v}`)
    .join('  ')
}
