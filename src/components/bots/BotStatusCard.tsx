import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import type { BotStatus } from '../../types'
import { formatDateTime } from '../../utils/format'

const statusVariant = (status: string) => {
  if (status === 'ACTIVE') return 'green'
  if (status === 'PAUSED' || status === 'IDLE') return 'yellow'
  if (status === 'STOPPED') return 'red'
  return 'gray'
}

interface BotStatusCardProps {
  bot: BotStatus
}

export function BotStatusCard({ bot }: BotStatusCardProps) {
  return (
    <Card title="status">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xl font-bold text-white capitalize">{bot.botId}-bot</p>
        <Badge variant={statusVariant(bot.status)}>{bot.status}</Badge>
      </div>
      <div className="mt-3 divide-y divide-zinc-800">
        <div className="flex items-start justify-between gap-4 py-2">
          <span className="text-sm text-zinc-400">Updated</span>
          <span className="text-sm font-semibold text-white">
            {bot.lastUpdate ? formatDateTime(bot.lastUpdate) : '—'}
          </span>
        </div>
        {bot.nextCycleAt && (
          <div className="flex items-start justify-between gap-4 py-2">
            <span className="text-sm text-zinc-400">Next cycle</span>
            <span className="text-sm font-semibold text-white">
              {formatDateTime(bot.nextCycleAt)}
            </span>
          </div>
        )}
      </div>
    </Card>
  )
}
