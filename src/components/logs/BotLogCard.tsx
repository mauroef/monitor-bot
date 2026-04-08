import { useRef, useEffect } from 'react'
import { Skeleton } from '../ui/Skeleton'
import { useGridLogs, useTradingLogs, levelColor, formatLogData } from '../../hooks/useBotLog'
import type { GridLogEntry } from '../../hooks/useBotLog'
import { formatDateTime } from '../../utils/format'
import { useLocalStorage } from '../../hooks/useLocalStorage'

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className={`size-3 shrink-0 text-zinc-500 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
  >
    <path
      fillRule="evenodd"
      d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L9.19 8 6.22 5.03a.75.75 0 0 1 0-1.06Z"
      clipRule="evenodd"
    />
  </svg>
)

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
  const [open, setOpen] = useLocalStorage(storageKey, true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [entries?.length, open])

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-zinc-800/50"
      >
        <Chevron open={open} />
        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">log</span>
        {entries?.length ? (
          <span className="ml-auto text-xs text-zinc-600">{entries.length} entries</span>
        ) : null}
      </button>

      <div className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div
            className="overflow-y-auto border-t border-zinc-800 bg-zinc-950 px-3 py-2"
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
        </div>
      </div>
    </div>
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
