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
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {orders.map((o) => (
                <tr key={o.id} className="text-zinc-300">
                  <td className="py-2">
                    <Badge variant={o.side === 'buy' ? 'green' : 'red'}>
                      {o.side.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-2 text-right font-mono">{o.price.toLocaleString()}</td>
                  <td className="py-2 text-right font-mono">{o.quantity.toFixed(5)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
