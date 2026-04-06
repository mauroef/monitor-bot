import { useRef, useEffect } from 'react'
import { Card } from '../ui/Card'
import { Skeleton } from '../ui/Skeleton'
import { useGridLogs, useTradingLogs, levelColor, formatLogData } from '../../hooks/useBotLog'
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
  entries,
  isLoading,
  error,
}: {
  entries: GridLogEntry[] | undefined
  isLoading: boolean
  error: unknown
}) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [entries?.length])

  return (
    <Card title="log">
      <div className="overflow-y-auto rounded bg-zinc-950 px-3 py-2" style={{ maxHeight: '320px' }}>
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
  return <LogContainer entries={data} isLoading={isLoading} error={error} />
}

export function TradingBotLogCard() {
  const { data, isLoading, error } = useTradingLogs()
  return <LogContainer entries={data as GridLogEntry[] | undefined} isLoading={isLoading} error={error} />
}
