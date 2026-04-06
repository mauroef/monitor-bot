import { useTradingBalance } from '../../hooks/useTradingBalance'
import { Card } from '../ui/Card'
import { Skeleton } from '../ui/Skeleton'

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="text-sm text-zinc-400">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  )
}

export function BalanceWidget() {
  const { data: balance, isLoading, error } = useTradingBalance()

  const symbol = balance?.symbol ?? 'BTCUSDT'
  const baseAsset = symbol.replace('USDT', '')
  const baseFree = balance ? String(balance[`${baseAsset}Free`] ?? '—') : '—'
  const baseLocked = balance ? String(balance[`${baseAsset}Locked`] ?? '—') : '—'

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
          Exchange unreachable — {(error as Error).message}
        </p>
      ) : balance ? (
        <div className="divide-y divide-zinc-800">
          <div className="pb-3">
            <p className="text-xs text-zinc-500">{symbol}</p>
            <p className="text-2xl font-bold tabular-nums text-white">{balance.currentPrice}</p>
          </div>

          <div className="py-1">
            <Row label="USDT free" value={balance.usdtFree} />
            <Row label="USDT locked" value={balance.usdtLocked} />
          </div>

          <div className="py-1">
            <Row label={`${baseAsset} free`} value={baseFree} />
            <Row label={`${baseAsset} locked`} value={baseLocked} />
          </div>

          <div className="pt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-300">Total portfolio</span>
              <span className="text-base font-bold text-emerald-400">{balance.totalPortfolio}</span>
            </div>
          </div>
        </div>
      ) : null}
    </Card>
  )
}
