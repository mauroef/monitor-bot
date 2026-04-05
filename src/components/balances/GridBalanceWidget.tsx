import { useGridBalance } from '../../hooks/useGridBalance'
import { useDashboard } from '../../hooks/useDashboard'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Skeleton } from '../ui/Skeleton'

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
  const { data: dashboard } = useDashboard()

  const gridBot = dashboard?.bots.find((b) => b.botType === 'grid')
  const testnet = gridBot?.testnet ?? true
  const exchange = gridBot?.exchange ?? 'binance'

  const notInitialized = !grid || grid.status === 'not_initialized'
  const baseAsset = grid?.symbol?.replace(/USDT$/i, '') ?? 'BASE'

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          {exchange} · grid-bot
        </h2>
        <Badge variant={testnet ? 'yellow' : 'green'}>
          {testnet ? 'testnet' : 'mainnet'}
        </Badge>
      </div>

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
        <p className="py-4 text-center text-xs text-zinc-500">Grid not started yet</p>
      ) : (
        <div className="divide-y divide-zinc-800">
          {/* Grid range as context */}
          <div className="pb-3">
            <p className="text-xs text-zinc-500">{grid.symbol}</p>
            <p className="text-sm text-zinc-400">
              Grid{' '}
              <span className="font-semibold text-white">
                {grid.grid.lower} – {grid.grid.upper}
              </span>
            </p>
          </div>

          {/* USDT */}
          <div className="py-1">
            <Row label="USDT free" value={grid.account.freeBalance} />
            <Row label="USDT in buys" value={grid.account.usdtInBuys} />
          </div>

          {/* base asset */}
          <div className="py-1">
            <Row label={`${baseAsset} in sells`} value={grid.account.btcInSells} />
            <Row label="Capital deployed" value={grid.account.capitalDeployed} />
          </div>

          {/* Total */}
          <div className="pt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-300">Total portfolio</span>
              <span className="text-base font-bold text-emerald-400">
                {grid.account.totalPortfolio}
              </span>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
