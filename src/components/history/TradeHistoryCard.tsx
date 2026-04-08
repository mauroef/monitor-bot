import { Badge } from '../ui/Badge'
import { Skeleton } from '../ui/Skeleton'
import { useSignalHistory } from '../../hooks/useSignalHistory'
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

function pnlColor(value: string | null) {
  if (!value) return 'text-zinc-500'
  const n = parseFloat(value)
  if (isNaN(n)) return 'text-zinc-500'
  return n >= 0 ? 'text-emerald-400' : 'text-red-400'
}

/** Strip trailing " USDT", " BTC", etc. for compact display */
function stripUnit(value: string | null) {
  if (!value) return '—'
  return value.replace(/\s+(USDT|BTC|ETH|SOL|BNB)$/i, '')
}

export function TradeHistoryCard() {
  const { data, isLoading, error } = useSignalHistory()
  const [open, setOpen] = useLocalStorage('history-signal', false)

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-zinc-800/50"
      >
        <Chevron open={open} />
        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          trade history
        </span>
        {data?.length ? (
          <span className="ml-auto text-xs text-zinc-600">{data.length} trades</span>
        ) : null}
      </button>

      {open && (
        <div className="border-t border-zinc-800">
          {isLoading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          ) : error ? (
            <p className="py-4 text-center text-xs text-red-400">
              Unreachable — {(error as Error).message}
            </p>
          ) : !data?.length ? (
            <p className="py-4 text-center text-sm text-zinc-500">No closed trades yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-left text-xs text-zinc-500">
                    <th className="px-4 py-2 font-medium">Side</th>
                    <th className="px-4 py-2 font-medium text-right">Entry</th>
                    <th className="px-4 py-2 font-medium text-right">Close</th>
                    <th className="px-4 py-2 font-medium text-right">Qty</th>
                    <th className="px-4 py-2 font-medium text-right">~USDT</th>
                    <th className="px-4 py-2 font-medium text-right">Net PnL</th>
                    <th className="px-4 py-2 font-medium">Opened</th>
                    <th className="px-4 py-2 font-medium">Closed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {[...data].reverse().map((t) => (
                    <tr key={t.id} className="text-zinc-300 hover:bg-zinc-800/30">
                      <td className="px-4 py-2">
                        <Badge variant={t.side.toLowerCase() === 'buy' ? 'green' : 'red'}>
                          {t.side.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 text-right font-mono">{stripUnit(t.entryPrice)}</td>
                      <td className="px-4 py-2 text-right font-mono">{stripUnit(t.closePrice)}</td>
                      <td className="px-4 py-2 text-right font-mono">{stripUnit(t.qty)}</td>
                      <td className="px-4 py-2 text-right font-mono text-zinc-400">
                        {stripUnit(t.notionalUsdt)}
                      </td>
                      <td className={`px-4 py-2 text-right font-mono font-semibold ${pnlColor(t.pnl.net)}`}>
                        {stripUnit(t.pnl.net)}
                      </td>
                      <td className="px-4 py-2 font-mono text-xs text-zinc-500">{t.openedAt}</td>
                      <td className="px-4 py-2 font-mono text-xs text-zinc-500">{t.closedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
