import { CollapsibleCard } from '../ui/CollapsibleCard'
import { Skeleton } from '../ui/Skeleton'
import { Tooltip } from '../ui/Tooltip'
import { useGridBalance } from '../../hooks/useGridBalance'
import type { GridBotGridResponse } from '../../types'

function parseNum(str: string | null | undefined): number {
  if (!str) return 0
  return parseFloat(str) || 0
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
                <Tooltip content={`${l.qty} · placed ${l.placedAt.slice(11, 16)}`} placement="top-left">
                  <span
                    className={`w-8 shrink-0 cursor-default text-xs font-medium ${isBuy ? 'text-emerald-400' : 'text-red-400'}`}
                  >
                    {l.side}
                  </span>
                </Tooltip>
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
            <Tooltip
              content={
                coincidentLevel
                  ? `${coincidentLevel.qty} · placed ${coincidentLevel.placedAt.slice(11, 16)}`
                  : 'Current market price'
              }
              placement="top-left"
            >
              <span
                className={`w-8 shrink-0 cursor-default text-xs font-medium ${
                  coincidentLevel
                    ? coincidentLevel.side === 'BUY' ? 'text-emerald-400' : 'text-red-400'
                    : 'text-center text-yellow-400'
                }`}
              >
                {coincidentLevel ? coincidentLevel.side : '●'}
              </span>
            </Tooltip>
          </div>
        )}
      </div>

      <div className="mt-2 flex items-center justify-center gap-6 text-xs text-zinc-500">
        <Tooltip content="Pending buy order — executes when price drops to this level">
          <span className="flex cursor-default items-center gap-1.5">
            <span className="inline-block w-4 border-t border-dashed border-emerald-500/60" /> BUY
          </span>
        </Tooltip>
        <Tooltip content="Pending sell order — executes when price rises to this level">
          <span className="flex cursor-default items-center gap-1.5">
            <span className="inline-block w-4 border-t border-dashed border-red-500/60" /> SELL
          </span>
        </Tooltip>
        <Tooltip content="Current market price">
          <span className="flex cursor-default items-center gap-1.5">
            <span className="inline-block h-0.5 w-4 bg-yellow-400/80" /> price
          </span>
        </Tooltip>
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
        </>
      )}
    </CollapsibleCard>
  )
}
