import { useGridBalance } from '../../hooks/useGridBalance'
import { Card } from '../ui/Card'
import { Skeleton } from '../ui/Skeleton'
import { CoinIcon } from '../ui/CoinIcon'

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="text-sm text-zinc-400">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  )
}

export function GridBalanceWidget() {
  const { data: grid, isLoading, error } = useGridBalance()

  const notInitialized =
    !grid ||
    grid.status === 'not_initialized' ||
    grid.status === 'PENDING_INIT' ||
    !grid.account ||
    !grid.grid
  const baseAsset = grid?.symbol?.replace(/USDT$/i, '') ?? 'BASE'

  return (
    <Card title="balance">
      {isLoading ? (
        <div className="space-y-3 pt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      ) : error ? (
        <p className="py-4 text-center text-xs text-red-400">
          Unreachable — {(error as Error).message}
        </p>
      ) : notInitialized ? (
        <p className="py-4 text-center text-xs text-zinc-500">
          {grid?.status === 'PENDING_INIT' ? 'Resetting — starts on next cycle' : 'Grid not started yet'}
        </p>
      ) : (
        <div className="divide-y divide-zinc-800">
          <div className="pb-3">
            <p className="text-xs text-zinc-500">{grid.symbol}</p>
            <div className="mt-1.5 flex items-center gap-2">
              <CoinIcon asset={baseAsset} className="size-8 shrink-0" />
              {grid.currentPrice ? (
                <p className="text-2xl font-bold tabular-nums text-white">{grid.currentPrice}</p>
              ) : (
                <p className="text-sm text-zinc-400">
                  Grid{' '}
                  <span className="font-semibold text-white">
                    {grid.grid!.lower} – {grid.grid!.upper}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* USDT */}
          <div className="py-1">
            <Row label="USDT free" value={grid.account!.freeBalance} />
            <Row label="USDT in buys" value={grid.account!.usdtInBuys} />
          </div>

          {/* base asset */}
          <div className="py-1">
            <Row label={`${baseAsset} in sells`} value={grid.account!.baseInSells} />
            <Row label="Capital deployed" value={grid.account!.capitalDeployed} />
          </div>

          {/* Total */}
          <div className="pt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-300">Total portfolio</span>
              <span className="text-base font-bold text-emerald-400">
                {grid.account!.totalPortfolio}
              </span>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
