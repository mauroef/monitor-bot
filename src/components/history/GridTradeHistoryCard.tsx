import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts'
import { Skeleton } from '../ui/Skeleton'
import { CollapsibleCard } from '../ui/CollapsibleCard'
import { useGridBalance } from '../../hooks/useGridBalance'
import { getQuoteAsset } from '../../utils/format'
import type { GridBotGridResponse } from '../../types'

type Cycle = GridBotGridResponse['recentCycles'][number]

function parseNum(str: string | null | undefined): number {
  if (!str) return 0
  return parseFloat(str) || 0
}

function stripUnit(value: string | null | undefined) {
  if (!value) return '—'
  return value.replace(/\s+(USDT|BTC|ETH|SOL|BNB|USDC)$/i, '')
}

function pnlColor(value: string | null | undefined) {
  if (!value) return 'text-zinc-500'
  const n = parseFloat(value)
  if (isNaN(n)) return 'text-zinc-500'
  return n >= 0 ? 'text-emerald-400' : 'text-red-400'
}

function shortDate(value: string) {
  return value.slice(5, 16)
}

function makeCycleTooltip(quoteAsset: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function CycleTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    const gross: number = payload.find((p: any) => p.dataKey === 'gross')?.value ?? 0
    const cum: number = payload.find((p: any) => p.dataKey === 'cumulative')?.value ?? 0
    return (
      <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs shadow-lg">
        <p className="mb-1 text-zinc-400">{label}</p>
        <p className={gross >= 0 ? 'text-emerald-400' : 'text-red-400'}>
          Cycle: {gross >= 0 ? '+' : ''}{gross.toFixed(4)} {quoteAsset}
        </p>
        <p className={cum >= 0 ? 'text-emerald-300' : 'text-red-300'}>
          Cumulative: {cum >= 0 ? '+' : ''}{cum.toFixed(4)} {quoteAsset}
        </p>
      </div>
    )
  }
}

function CyclesPnLChart({ cycles, symbol }: { cycles: Cycle[]; symbol: string }) {
  const CycleTooltip = makeCycleTooltip(getQuoteAsset(symbol))
  let cumulative = 0
  // Backend sends newest-first; reverse so chart reads oldest → newest left to right
  const chartData = [...cycles].reverse().map((c, i) => {
    const gross = parseNum(c.grossPnl)
    cumulative = +(cumulative + gross).toFixed(4)
    return {
      label: c.completedAt ? shortDate(c.completedAt) : `#${i + 1}`,
      gross: +gross.toFixed(4),
      cumulative,
    }
  })

  const allGross = chartData.map((d) => d.gross)
  const maxAbs = Math.max(...allGross.map(Math.abs), 0.001)
  const barDomain: [number, number] = [-maxAbs * 1.3, maxAbs * 1.3]

  return (
    <div className="px-4 pb-2 pt-4">
      <ResponsiveContainer width="100%" height={180}>
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
            tickFormatter={(v) => v.toFixed(3)}
          />
          <YAxis
            yAxisId="line"
            orientation="right"
            tick={{ fill: '#71717a', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            width={52}
            tickFormatter={(v) => v.toFixed(3)}
          />
          <RechartsTooltip content={<CycleTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <ReferenceLine yAxisId="bar" y={0} stroke="#3f3f46" />
          <Bar yAxisId="bar" dataKey="gross" maxBarSize={24} radius={[2, 2, 0, 0]}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.gross >= 0 ? '#10b981' : '#ef4444'} fillOpacity={0.75} />
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
          <span className="inline-block h-2 w-3 rounded-sm bg-emerald-500/70" /> cycle PnL
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 bg-emerald-400" /> cumulative
        </span>
      </div>
    </div>
  )
}

export function GridTradeHistoryCard() {
  const { data: grid, isLoading, error } = useGridBalance()

  const cycles = grid?.recentCycles ?? []
  const symbol = grid?.symbol ?? ''

  return (
    <CollapsibleCard
      storageKey="history-grid"
      title="cycle history"
      meta={cycles.length ? `${cycles.length} recent cycles` : undefined}
      defaultOpen={false}
    >
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
      ) : !cycles.length ? (
        <p className="py-4 text-center text-sm text-zinc-500">No completed cycles yet</p>
      ) : (
        <>
          <CyclesPnLChart cycles={cycles} symbol={symbol} />
          <div className="border-t border-zinc-800 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-left text-xs text-zinc-500">
                  <th className="px-4 py-2 font-medium text-right">Buy</th>
                  <th className="px-4 py-2 font-medium text-right">Sell</th>
                  <th className="px-4 py-2 font-medium text-right">Qty</th>
                  <th className="px-4 py-2 font-medium text-right">Gross PnL</th>
                  <th className="px-4 py-2 font-medium">Completed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {cycles.map((c) => (
                  <tr key={c.id} className="text-zinc-300 hover:bg-zinc-800/30">
                    <td className="px-4 py-2 text-right font-mono">{stripUnit(c.buyPrice)}</td>
                    <td className="px-4 py-2 text-right font-mono">{stripUnit(c.sellPrice)}</td>
                    <td className="px-4 py-2 text-right font-mono">{stripUnit(c.qty)}</td>
                    <td className={`px-4 py-2 text-right font-mono font-semibold ${pnlColor(c.grossPnl)}`}>
                      {stripUnit(c.grossPnl)}
                    </td>
                    <td className="px-4 py-2 font-mono text-xs text-zinc-500">{c.completedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </CollapsibleCard>
  )
}
