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
    <Card>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            {bot.exchange} · {bot.botType}-bot
          </p>
          <p className="mt-1 text-xl font-bold text-white capitalize">{bot.botId}-bot</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <Badge variant={statusVariant(bot.status)}>{bot.status}</Badge>
          <Badge variant={bot.testnet ? 'yellow' : 'green'}>
            {bot.testnet ? 'testnet' : 'mainnet'}
          </Badge>
        </div>
      </div>
      <p className="mt-3 text-xs text-zinc-500">
        Updated: {bot.lastUpdate ? formatDateTime(bot.lastUpdate) : '—'}
      </p>
    </Card>
  )
}
