type Variant = 'green' | 'red' | 'yellow' | 'gray'

const styles: Record<Variant, string> = {
  green: 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/30',
  red: 'bg-red-500/15 text-red-400 ring-red-500/30',
  yellow: 'bg-yellow-500/15 text-yellow-400 ring-yellow-500/30',
  gray: 'bg-zinc-500/15 text-zinc-400 ring-zinc-500/30',
}

interface BadgeProps {
  variant: Variant
  children: React.ReactNode
}

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${styles[variant]}`}
    >
      {children}
    </span>
  )
}
