import { CollapsibleCard } from '../ui/CollapsibleCard'
import { Badge } from '../ui/Badge'
import type { Order } from '../../types'

interface OrdersTableProps {
  storageKey: string
  orders: Order[]
}

export function OrdersTable({ storageKey, orders }: OrdersTableProps) {
  return (
    <CollapsibleCard
      storageKey={storageKey}
      title="open orders"
      meta={`${orders.length} orders`}
    >
      {orders.length === 0 ? (
        <p className="py-4 text-center text-sm text-zinc-500">No open orders</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-left text-xs text-zinc-500">
                <th className="px-4 pb-2 pt-3 font-medium">Side</th>
                <th className="px-4 pb-2 pt-3 font-medium text-right">Price</th>
                <th className="px-4 pb-2 pt-3 font-medium text-right">Qty</th>
                <th className="px-4 pb-2 pt-3 font-medium text-right">~USDT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {orders.map((o) => {
                const usdt = (o.price * o.quantity).toFixed(2)
                const hasSLTP = o.stopLoss || o.takeProfit
                return (
                  <>
                    <tr key={o.id} className="text-zinc-300">
                      <td className="px-4 pt-2 pb-0.5">
                        <Badge variant={o.side === 'buy' ? 'green' : 'red'}>
                          {o.side.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-4 pt-2 pb-0.5 text-right font-mono">{o.price.toLocaleString()}</td>
                      <td className="px-4 pt-2 pb-0.5 text-right font-mono">{o.quantity.toFixed(5)}</td>
                      <td className="px-4 pt-2 pb-0.5 text-right font-mono text-zinc-400">{usdt}</td>
                    </tr>
                    {hasSLTP && (
                      <tr key={`${o.id}-sltp`} className="border-0">
                        <td colSpan={4} className="px-4 pb-2 pt-0 font-mono text-xs">
                          {o.stopLoss && (
                            <span className="text-red-400/80">SL {o.stopLoss.toLocaleString()}</span>
                          )}
                          {o.stopLoss && o.takeProfit && (
                            <span className="mx-2 text-zinc-700">·</span>
                          )}
                          {o.takeProfit && (
                            <span className="text-emerald-400/80">TP {o.takeProfit.toLocaleString()}</span>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </CollapsibleCard>
  )
}
