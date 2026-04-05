interface CardProps {
  title?: string
  children: React.ReactNode
  className?: string
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`rounded-xl border border-zinc-800 bg-zinc-900 p-4 ${className}`}>
      {title && (
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
          {title}
        </h2>
      )}
      {children}
    </div>
  )
}
