import { useLocalStorage } from '../../hooks/useLocalStorage'

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className={`size-3 shrink-0 text-zinc-500 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
  >
    <path
      fillRule="evenodd"
      d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L9.19 8 6.22 5.03a.75.75 0 0 1 0-1.06Z"
      clipRule="evenodd"
    />
  </svg>
)

interface CollapsibleCardProps {
  storageKey: string
  title: string
  icon?: React.ReactNode
  meta?: React.ReactNode
  defaultOpen?: boolean
  /** Called when the panel transitions from closed → open */
  onOpen?: () => void
  children: React.ReactNode
}

export function CollapsibleCard({
  storageKey,
  title,
  icon,
  meta,
  defaultOpen = true,
  onOpen,
  children,
}: CollapsibleCardProps) {
  const [open, setOpen] = useLocalStorage(storageKey, defaultOpen)

  const toggle = () => {
    const next = !open
    setOpen(next)
    if (next) onOpen?.()
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
      <button
        onClick={toggle}
        className="flex w-full items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-zinc-800/50"
      >
        <Chevron open={open} />
        {icon && <span className="text-zinc-500">{icon}</span>}
        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          {title}
        </span>
        {meta != null && (
          <span className="ml-auto text-xs text-zinc-600">{meta}</span>
        )}
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-zinc-800">{children}</div>
        </div>
      </div>
    </div>
  )
}
