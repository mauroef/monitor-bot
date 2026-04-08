import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts'
import { Badge } from '../ui/Badge'
import { Skeleton } from '../ui/Skeleton'
import { useSignalHistory } from '../../hooks/useSignalHistory'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import type { TradeHistoryEntry } from '../../api/tradingBot'

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

function stripUnit(value: string | null) {
  if (!value) return '—'
  return value.replace(/\s+(USDT|BTC|ETH|SOL|BNB)$/i, '')
}

function parseNet(value: string | null): number {
  if (!value) return 0
  return parseFloat(value) || 0
}

/** "2026-04-05 21:18:07" → "04-05 21:18" */
function shortDate(value: string) {
  return value.slice(5, 16)
}

interface ChartPoint {
  label: string
  net: number
  cumulative: number
}

function buildChartData(trades: TradeHistoryEntry[]): ChartPoint[] {
  let cumulative = 0
  return trades.map((t, i) => {
    const net = parseNet(t.pnl.net)
    cumulative = +(cumulative + net).toFixed(4)
    return {
      label: t.closedAt ? shortDate(t.closedAt) : `#${i + 1}`,
      net: +net.toFixed(4),
      cumulative,
    }
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const net: number = payload.find((p: any) => p.dataKey === 'net')?.value ?? 0
  const cum: number = payload.find((p: any) => p.dataKey === 'cumulative')?.value ?? 0
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 text-zinc-400">{label}</p>
      <p className={net >= 0 ? 'text-emerald-400' : 'text-red-400'}>
        Trade: {net >= 0 ? '+' : ''}{net} USDT
      </p>
      <p className={cum >= 0 ? 'text-emerald-300' : 'text-red-300'}>
        Cumulative: {cum >= 0 ? '+' : ''}{cum} USDT
      </p>
    </div>
  )
}

function PnLChart({ data }: { data: TradeHistoryEntry[] }) {
  const chartData = buildChartData(data)
  const allNets = chartData.map((d) => d.net)
  const maxAbs = Math.max(...allNets.map(Math.abs), 0.001)
  const barDomain: [number, number] = [-maxAbs * 1.3, maxAbs * 1.3]

  return (
    <div className="px-4 pb-2 pt-4">
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={chartData} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: '#71717a', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            yAxisId="bar"
            domain={barDomain}
            tick={{ fill: '#71717a', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            width={52}
            tickFormatter={(v) => v.toFixed(2)}
          />
          <YAxis
            yAxisId="line"
            orientation="right"
            tick={{ fill: '#71717a', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            width={52}
            tickFormatter={(v) => v.toFixed(2)}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <ReferenceLine yAxisId="bar" y={0} stroke="#3f3f46" />
          <Bar yAxisId="bar" dataKey="net" maxBarSize={24} radius={[2, 2, 0, 0]}>
            {chartData.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.net >= 0 ? '#10b981' : '#ef4444'}
                fillOpacity={0.75}
              />
            ))}
          </Bar>
          <Line
            yAxisId="line"
            type="monotone"
            dataKey="cumulative"
            stroke="#34d399"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#34d399', strokeWidth: 0 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="mt-1 flex items-center justify-center gap-6 text-xs text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-3 rounded-sm bg-emerald-500/70" /> trade PnL
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 bg-emerald-400" /> cumulative
        </span>
      </div>
    </div>
  )
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

      <div className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
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
              <>
                <PnLChart data={data} />
                <div className="border-t border-zinc-800 overflow-x-auto">
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
