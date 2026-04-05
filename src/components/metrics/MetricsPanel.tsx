import { Card } from '../ui/Card'
import type { BotMetrics } from '../../types'

interface MetricsPanelProps {
  metrics: BotMetrics
}

const pnlColor = (value: unknown) => {
  const n = parseFloat(String(value))
  if (isNaN(n)) return 'text-zinc-300'
  return n >= 0 ? 'text-emerald-400' : 'text-red-400'
}

const PNL_KEYS = ['totalNetPnl', 'totalGrossPnl']

export function MetricsPanel({ metrics }: MetricsPanelProps) {
  return (
    <Card title={`${metrics.botType}-bot metrics`}>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
        {Object.entries(metrics.metrics).map(([key, value]) => (
          <div key={key}>
            <dt className="text-xs text-zinc-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</dt>
            <dd className={`mt-0.5 text-sm font-semibold ${PNL_KEYS.includes(key) ? pnlColor(value) : 'text-zinc-200'}`}>
              {String(value)}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}
