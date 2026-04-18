import { useState, useRef, type ReactNode } from 'react'

type Placement = 'top' | 'top-left'

interface TooltipProps {
  content: ReactNode
  children: ReactNode
  className?: string
  /** top (default): centered above trigger. top-left: anchored to right edge, extends left. */
  placement?: Placement
}

export function Tooltip({ content, children, className, placement = 'top' }: TooltipProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    if (placement === 'top-left') {
      setPos({ x: rect.right, y: rect.top })
    } else {
      setPos({ x: rect.left + rect.width / 2, y: rect.top })
    }
  }

  const tooltipStyle: React.CSSProperties =
    placement === 'top-left'
      ? { position: 'fixed', left: pos?.x, top: pos ? pos.y - 8 : 0, transform: 'translate(-100%, -100%)', zIndex: 9999 }
      : { position: 'fixed', left: pos?.x, top: pos ? pos.y - 8 : 0, transform: 'translate(-50%, -100%)', zIndex: 9999 }

  return (
    <div
      ref={ref}
      className={`inline-block ${className ?? ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setPos(null)}
    >
      {children}
      {pos && (
        <div
          style={tooltipStyle}
          className="pointer-events-none whitespace-nowrap rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-300 shadow-lg"
        >
          {content}
          {placement === 'top-left' ? (
            <div className="absolute right-2 top-full h-0 w-0 border-x-4 border-t-4 border-x-transparent border-t-zinc-700" />
          ) : (
            <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-4 border-t-4 border-x-transparent border-t-zinc-700" />
          )}
        </div>
      )}
    </div>
  )
}
