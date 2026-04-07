import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import type { Order } from '../../types'

interface OrdersTableProps {
  orders: Order[]
}

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <Card title={`Open Orders (${orders.length})`}>
      {orders.length === 0 ? (
        <p className="py-4 text-center text-sm text-zinc-500">No open orders</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-left text-xs text-zinc-500">
                <th className="pb-2 font-medium">Side</th>
                <th className="pb-2 font-medium text-right">Price</th>
                <th className="pb-2 font-medium text-right">Qty</th>
                <th className="pb-2 font-medium text-right">~USDT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {orders.map((o) => {
                const usdt = (o.price * o.quantity).toFixed(2)
                const hasSLTP = o.stopLoss || o.takeProfit
                return (
                  <>
                    <tr key={o.id} className="text-zinc-300">
                      <td className="pt-2 pb-0.5">
                        <Badge variant={o.side === 'buy' ? 'green' : 'red'}>
                          {o.side.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="pt-2 pb-0.5 text-right font-mono">{o.price.toLocaleString()}</td>
                      <td className="pt-2 pb-0.5 text-right font-mono">{o.quantity.toFixed(5)}</td>
                      <td className="pt-2 pb-0.5 text-right font-mono text-zinc-400">{usdt}</td>
                    </tr>
                    {hasSLTP && (
                      <tr key={`${o.id}-sltp`} className="border-0">
                        <td colSpan={4} className="pb-2 pt-0 font-mono text-xs">
                          {o.stopLoss && (
                            <span className="text-red-400/80">
                              SL {o.stopLoss.toLocaleString()}
                            </span>
                          )}
                          {o.stopLoss && o.takeProfit && (
                            <span className="mx-2 text-zinc-700">·</span>
                          )}
                          {o.takeProfit && (
                            <span className="text-emerald-400/80">
                              TP {o.takeProfit.toLocaleString()}
                            </span>
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
    </Card>
  )
}
