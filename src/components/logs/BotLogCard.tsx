import { useRef, useEffect } from 'react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Skeleton } from '../ui/Skeleton'
import { useGridLogs, useTradingLogs, levelColor, formatLogData } from '../../hooks/useBotLog'
import { useDashboard } from '../../hooks/useDashboard'
import type { GridLogEntry } from '../../hooks/useBotLog'
import { formatDateTime } from '../../utils/format'

function LogLine({ entry }: { entry: GridLogEntry }) {
  const time = formatDateTime(entry.ts)
  const hasData = Object.keys(entry.data).length > 0

  return (
    <div className="font-mono text-xs leading-5 py-0.5">
      <div className="flex items-baseline gap-2 min-w-0">
        <span className="shrink-0 text-zinc-600">{time}</span>
        <span className={`shrink-0 w-10 font-semibold ${levelColor(entry.level)}`}>
          {entry.level}
        </span>
        <span className="text-zinc-200 wrap-break-word min-w-0">{entry.message}</span>
      </div>
      {hasData && (
        <div className="pl-0 text-zinc-500 break-all whitespace-pre-wrap">
          {formatLogData(entry.data)}
        </div>
      )}
    </div>
  )
}

function LogContainer({
  title,
  exchange,
  testnet,
  entries,
  isLoading,
  error,
}: {
  title: string
  exchange: string
  testnet: boolean
  entries: GridLogEntry[] | undefined
  isLoading: boolean
  error: unknown
}) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [entries?.length])

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          {exchange} · {title}
        </h2>
        <Badge variant={testnet ? 'yellow' : 'green'}>{testnet ? 'testnet' : 'mainnet'}</Badge>
      </div>

      <div className="overflow-y-auto rounded bg-zinc-900 px-3 py-2" style={{ maxHeight: '320px', overflowY: 'auto' }}>
        {isLoading ? (
          <div className="space-y-2 pt-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-3 w-full" />
            ))}
          </div>
        ) : error ? (
          <p className="py-2 text-center font-mono text-xs text-red-400">
            Unreachable — {(error as Error).message}
          </p>
        ) : !entries?.length ? (
          <p className="py-2 text-center font-mono text-xs text-zinc-600">No logs yet</p>
        ) : (
          <>
            {entries.map((e) => (
              <LogLine key={e.id} entry={e} />
            ))}
            <div ref={bottomRef} />
          </>
        )}
      </div>
    </Card>
  )
}

export function GridBotLogCard() {
  const { data, isLoading, error } = useGridLogs()
  const { data: dashboard } = useDashboard()
  const bot = dashboard?.bots.find((b) => b.botType === 'grid')

  return (
    <LogContainer
      title="grid-bot log"
      exchange={bot?.exchange ?? 'binance'}
      testnet={bot?.testnet ?? true}
      entries={data}
      isLoading={isLoading}
      error={error}
    />
  )
}

export function TradingBotLogCard() {
  const { data, isLoading, error } = useTradingLogs()
  const { data: dashboard } = useDashboard()
  const bot = dashboard?.bots.find((b) => b.botType === 'trading')

  return (
    <LogContainer
      title="trading-bot log"
      exchange={bot?.exchange ?? 'exchange'}
      testnet={bot?.testnet ?? true}
      entries={data as GridLogEntry[] | undefined}
      isLoading={isLoading}
      error={error}
    />
  )
}
