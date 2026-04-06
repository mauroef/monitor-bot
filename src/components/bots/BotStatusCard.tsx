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
      <p className="mt-3 text-xs text-zinc-500">
        Updated: {bot.lastUpdate ? formatDateTime(bot.lastUpdate) : '—'}
      </p>
    </Card>
  )
}
