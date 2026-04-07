import { useState, useEffect } from 'react'
import { RefreshBar } from '../ui/RefreshBar'

function Clock() {
  const [time, setTime] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')
  const formatted =
    `${time.getFullYear()}-${pad(time.getMonth() + 1)}-${pad(time.getDate())} ` +
    `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`

  return <span className="font-mono text-xs text-zinc-500">{formatted}</span>
}

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight">
            <span className="text-emerald-400">●</span> monitor-bot
          </h1>
          <RefreshBar />
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
      <footer className="border-t border-zinc-800 px-6 py-4">
        <div className="mx-auto flex max-w-7xl justify-center">
          <Clock />
        </div>
      </footer>
    </div>
  )
}
