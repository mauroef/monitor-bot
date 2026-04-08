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
                <th className="px-4 pb-2 pt-3 font-medium text-right">SL</th>
                <th className="px-4 pb-2 pt-3 font-medium text-right">TP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {orders.map((o) => {
                const usdt = (o.price * o.quantity).toFixed(2)
                return (
                  <tr key={o.id} className="text-zinc-300">
                    <td className="px-4 py-2">
                      <Badge variant={o.side === 'buy' ? 'green' : 'red'}>
                        {o.side.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-4 py-2 text-right font-mono">{o.price.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right font-mono">{o.quantity.toFixed(5)}</td>
                    <td className="px-4 py-2 text-right font-mono text-zinc-400">{usdt}</td>
                    <td className="px-4 py-2 text-right font-mono text-red-400/80">
                      {o.stopLoss ? o.stopLoss.toLocaleString() : <span className="text-zinc-700">—</span>}
                    </td>
                    <td className="px-4 py-2 text-right font-mono text-emerald-400/80">
                      {o.takeProfit ? o.takeProfit.toLocaleString() : <span className="text-zinc-700">—</span>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </CollapsibleCard>
  )
}
