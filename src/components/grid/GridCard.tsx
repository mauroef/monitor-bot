import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { CollapsibleCard } from '../ui/CollapsibleCard'
import { Skeleton } from '../ui/Skeleton'
import { useGridBalance } from '../../hooks/useGridBalance'
import type { GridBotGridResponse } from '../../types'
import { getQuoteAsset } from '../../utils/format'

function parseNum(str: string | null | undefined): number {
  if (!str) return 0
  return parseFloat(str) || 0
}

function shortDate(value: string) {
  return value.slice(5, 16)
}

// ─── Price Ladder ─────────────────────────────────────────────────────────────

function PriceLadder({
  grid,
  levels,
  currentPrice,
}: {
  grid: NonNullable<GridBotGridResponse['grid']>
  levels: NonNullable<GridBotGridResponse['levels']>
  currentPrice: string | null
}) {
  const lower = parseNum(grid.lower)
  const upper = parseNum(grid.upper)
  const current = parseNum(currentPrice)
  const range = upper - lower || 1

  // 12% padding so labels at the extremes don't clip
  const pad = range * 0.12
  const paddedLower = lower - pad
  const paddedRange = upper + pad - paddedLower

  const pct = (price: number) =>
    `${((price - paddedLower) / paddedRange) * 100}%`

  // Levels that coincide with the current price are absorbed into the price indicator.
  // Use epsilon comparison to avoid float representation mismatches.
  const coincidentLevel = currentPrice
    ? levels.detail.find((l) => Math.abs(parseNum(l.price) - current) < 1e-9)
    : undefined

  return (
    <div className="px-4 pb-2 pt-4">
      <div className="relative h-52">
        {levels.detail
          .filter((l) => l !== coincidentLevel)
          .map((l) => {
            const price = parseNum(l.price)
            const isBuy = l.side === 'BUY'
            return (
              <div
                key={l.orderId}
                className="absolute left-0 right-0 flex items-center gap-2"
                style={{ bottom: pct(price), transform: 'translateY(50%)' }}
              >
                <span className="w-14 shrink-0 text-right font-mono text-xs text-zinc-400">
                  {price.toFixed(2)}
                </span>
                <div
                  className={`flex-1 border-t border-dashed ${isBuy ? 'border-emerald-500/60' : 'border-red-500/60'}`}
                />
                <span
                  className={`w-8 shrink-0 text-xs font-medium ${isBuy ? 'text-emerald-400' : 'text-red-400'}`}
                >
                  {l.side}
                </span>
              </div>
            )
          })}

        {/* Current price — shows side badge if it coincides with a level */}
        {currentPrice && (
          <div
            className="absolute left-0 right-0 z-10 flex items-center gap-2"
            style={{ bottom: pct(current), transform: 'translateY(50%)' }}
          >
            <span className="w-14 shrink-0 text-right font-mono text-xs font-bold text-yellow-400">
              {current.toFixed(2)}
            </span>
            <div className="flex-1 border-t-2 border-yellow-400/80" />
            <span className="w-8 shrink-0 text-center text-xs">
              {coincidentLevel ? (
                <span
                  className={
                    coincidentLevel.side === 'BUY' ? 'text-emerald-400' : 'text-red-400'
                  }
                >
                  {coincidentLevel.side}
                </span>
              ) : (
                <span className="text-yellow-400">●</span>
              )}
            </span>
          </div>
        )}
      </div>

      <div className="mt-2 flex items-center justify-center gap-6 text-xs text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-4 border-t border-dashed border-emerald-500/60" /> BUY
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-4 border-t border-dashed border-red-500/60" /> SELL
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 bg-yellow-400/80" /> price
        </span>
      </div>
    </div>
  )
}

// ─── Cycles PnL Chart ─────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeCycleTooltip(quoteAsset: string) {
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

function CyclesPnLChart({ cycles, symbol }: { cycles: GridBotGridResponse['recentCycles']; symbol: string }) {
  const CycleTooltip = makeCycleTooltip(getQuoteAsset(symbol))
  let cumulative = 0
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
    <div className="border-t border-zinc-800 px-4 pb-2 pt-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
        Recent cycles
      </p>
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
          <Tooltip content={<CycleTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
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

// ─── Card ─────────────────────────────────────────────────────────────────────

export function GridCard() {
  const { data: grid, isLoading, error } = useGridBalance()

  const notInitialized = !grid || grid.status === 'not_initialized'
  const isPendingInit = grid?.status === 'PENDING_INIT'

  const meta = grid && !notInitialized
    ? `${grid.performance.totalCycles} cycles · ${isPendingInit ? 'resetting' : (grid.lastRegime?.regime ?? '—')}`
    : undefined

  return (
    <CollapsibleCard storageKey="grid-card" title="grid" meta={meta}>
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
      ) : notInitialized ? (
        <p className="py-4 text-center text-sm text-zinc-500">Grid not started yet</p>
      ) : (
        <>
          {isPendingInit ? (
            <p className="px-4 py-3 text-center text-xs text-zinc-500">
              Resetting — se reiniciará en el próximo ciclo
            </p>
          ) : (
            grid.grid && grid.levels && (
              <PriceLadder grid={grid.grid} levels={grid.levels} currentPrice={grid.currentPrice} />
            )
          )}
          {grid.recentCycles.length > 0 && <CyclesPnLChart cycles={grid.recentCycles} symbol={grid.symbol} />}
        </>
      )}
    </CollapsibleCard>
  )
}
