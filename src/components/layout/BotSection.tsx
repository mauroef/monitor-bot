import { Zap, Pause, OctagonX, Clock, FlaskConical, Globe } from 'lucide-react'
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

const statusIcon = (status: string) => {
  if (status === 'ACTIVE') return <Zap className="size-3" />
  if (status === 'PAUSED') return <Pause className="size-3" />
  if (status === 'STOPPED') return <OctagonX className="size-3" />
  if (status === 'IDLE') return <Clock className="size-3" />
  return null
}

interface BotSectionProps {
  title: string
  storageKey: string
  bot?: BotStatus
  errors?: Error[]
  actions?: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
}

export function BotSection({ title, storageKey, bot, errors, actions, children, defaultOpen = true }: BotSectionProps) {
  const [open, setOpen] = useLocalStorage(storageKey, defaultOpen)

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800">
      <div className="flex w-full items-center gap-3 bg-zinc-900 px-4 py-3 transition-colors hover:bg-zinc-800/60">
        <button
          onClick={() => setOpen(!open)}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
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
              <Badge variant={statusVariant(bot.status)}>
                {statusIcon(bot.status)}
                <span className="hidden sm:inline">{bot.status}</span>
              </Badge>
              <Badge variant={bot.testnet ? 'yellow' : 'green'}>
                {bot.testnet ? <FlaskConical className="size-3" /> : <Globe className="size-3" />}
                <span className="hidden sm:inline">{bot.testnet ? 'testnet' : 'mainnet'}</span>
              </Badge>
            </div>
          )}
        </button>

        {bot?.lastUpdate && (
          <span className="hidden sm:block text-xs text-zinc-600">{formatDateTime(bot.lastUpdate)}</span>
        )}

        {actions}
      </div>

      <div className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="space-y-4 border-t border-zinc-800 bg-zinc-950/60 p-4">
            {errors?.map((err) => (
              <div
                key={err.message}
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400"
              >
                {err.message}
              </div>
            ))}
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
