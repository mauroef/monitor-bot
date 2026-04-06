import { useIsFetching } from '@tanstack/react-query'
import { useRefreshCountdown } from '../../hooks/useRefreshCountdown'

export function RefreshBar() {
  const { countdown, total, refresh } = useRefreshCountdown()
  const isFetching = useIsFetching()
  const progress = (countdown / total) * 100

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={refresh}
        disabled={isFetching > 0}
        title="Refresh now"
        className="rounded p-1 text-zinc-500 transition-colors hover:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={isFetching ? 'animate-spin' : ''}
        >
          <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
        </svg>
      </button>

      <div className="flex flex-col items-end gap-1">
        <span className="text-xs tabular-nums text-zinc-500">{countdown}s</span>
        <div className="h-0.5 w-16 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-emerald-500 transition-[width] duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
