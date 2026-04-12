import { useRef, useEffect } from 'react'
import { Skeleton } from '../ui/Skeleton'
import { CollapsibleCard } from '../ui/CollapsibleCard'
import { useGridLogs, useTradingLogs, levelColor, formatLogData } from '../../hooks/useBotLog'
import type { GridLogEntry } from '../../hooks/useBotLog'
import { formatDateTime } from '../../utils/format'

const ACTION_STYLE: Record<string, string> = {
  BUY:  'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40',
  SELL: 'bg-red-500/20 text-red-300 ring-1 ring-red-500/40',
  HOLD: 'bg-zinc-700/60 text-zinc-400 ring-1 ring-zinc-600/40',
}

function ActionBadge({ action }: { action: string }) {
  const style = ACTION_STYLE[action.toUpperCase()] ?? 'bg-zinc-700/60 text-zinc-400'
  return (
    <span className={`shrink-0 rounded px-1.5 py-0.5 font-semibold uppercase leading-none ${style}`}>
      {action}
    </span>
  )
}

function LogLine({ entry }: { entry: GridLogEntry }) {
  const time = formatDateTime(entry.ts)
  const action = typeof entry.data?.action === 'string' ? entry.data.action : null
  const dataWithoutAction = action
    ? Object.fromEntries(Object.entries(entry.data).filter(([k]) => k !== 'action'))
    : entry.data
  const hasData = Object.keys(dataWithoutAction).length > 0

  return (
    <div className="font-mono text-xs leading-5 py-0.5">
      <div className="flex items-baseline gap-2 min-w-0">
        <span className="shrink-0 text-zinc-600">{time}</span>
        <span className={`shrink-0 w-10 font-semibold ${levelColor(entry.level)}`}>
          {entry.level}
        </span>
        {action && <ActionBadge action={action} />}
        <span className="text-zinc-200 wrap-break-word min-w-0">{entry.message}</span>
      </div>
      {hasData && (
        <div className="pl-0 text-zinc-500 break-all whitespace-pre-wrap">
          {formatLogData(dataWithoutAction)}
        </div>
      )}
    </div>
  )
}

function LogContainer({
  storageKey,
  entries,
  isLoading,
  error,
}: {
  storageKey: string
  entries: GridLogEntry[] | undefined
  isLoading: boolean
  error: unknown
}) {
  const bottomRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [entries?.length])

  return (
    <CollapsibleCard
      storageKey={storageKey}
      title="log"
      meta={entries?.length ? `${entries.length} entries` : undefined}
      onOpen={scrollToBottom}
    >
      <div
        className="overflow-y-auto bg-zinc-950 px-3 py-2"
        style={{ maxHeight: '320px' }}
      >
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
    </CollapsibleCard>
  )
}

export function GridBotLogCard() {
  const { data, isLoading, error } = useGridLogs()
  return (
    <LogContainer storageKey="log-grid" entries={data} isLoading={isLoading} error={error} />
  )
}

export function TradingBotLogCard() {
  const { data, isLoading, error } = useTradingLogs()
  return (
    <LogContainer
      storageKey="log-trading"
      entries={data as GridLogEntry[] | undefined}
      isLoading={isLoading}
      error={error}
    />
  )
}
