import type { BotStatus } from '../../types'
import { Badge } from '../ui/Badge'
import { formatDateTime } from '../../utils/format'
import { useLocalStorage } from '../../hooks/useLocalStorage'

const statusVariant = (status: string) => {
  if (status === 'ACTIVE') return 'green'
  if (status === 'PAUSED' || status === 'IDLE') return 'yellow'
  if (status === 'STOPPED') return 'red'
  return 'gray'
}

interface BotSectionProps {
  title: string
  storageKey: string
  bot?: BotStatus
  children: React.ReactNode
  defaultOpen?: boolean
}

export function BotSection({ title, storageKey, bot, children, defaultOpen = true }: BotSectionProps) {
  const [open, setOpen] = useLocalStorage(storageKey, defaultOpen)

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 bg-zinc-900 px-4 py-3 text-left transition-colors hover:bg-zinc-800/80"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className={`size-3.5 shrink-0 text-zinc-500 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
        >
          <path
            fillRule="evenodd"
            d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L9.19 8 6.22 5.03a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>

        <span className="text-sm font-semibold text-zinc-100">{title}</span>

        {bot && (
          <div className="flex items-center gap-1.5">
            <Badge variant={statusVariant(bot.status)}>{bot.status}</Badge>
            <Badge variant={bot.testnet ? 'yellow' : 'green'}>
              {bot.testnet ? 'testnet' : 'mainnet'}
            </Badge>
          </div>
        )}

        {bot?.lastUpdate && (
          <span className="ml-auto text-xs text-zinc-600">
            {formatDateTime(bot.lastUpdate)}
          </span>
        )}
      </button>

      {open && (
        <div className="space-y-4 border-t border-zinc-800 bg-zinc-950/60 p-4">
          {children}
        </div>
      )}
    </div>
  )
}
