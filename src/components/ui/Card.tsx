interface CardProps {
  title?: string
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function Card({ title, icon, children, className = '' }: CardProps) {
  return (
    <div className={`rounded-xl border border-zinc-800 bg-zinc-900 p-4 ${className}`}>
      {title && (
        <h2 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-zinc-500">
          {icon && <span>{icon}</span>}
          {title}
        </h2>
      )}
      {children}
    </div>
  )
}
