const KNOWN_QUOTE_ASSETS = ['USDC', 'USDT', 'BUSD', 'BTC', 'ETH', 'BNB']

/** Extract the quote asset from a trading symbol, e.g. 'SOLUSDC' → 'USDC', 'BTCUSDT' → 'USDT' */
export function getQuoteAsset(symbol: string): string {
  return KNOWN_QUOTE_ASSETS.find((q) => symbol.endsWith(q)) ?? 'USDT'
}

/** Extract the base asset from a trading symbol, e.g. 'SOLUSDC' → 'SOL', 'BTCUSDT' → 'BTC' */
export function getBaseAsset(symbol: string): string {
  const quote = getQuoteAsset(symbol)
  return symbol.slice(0, symbol.length - quote.length)
}

/** Format duration between two datetime strings as "2h 15m", "45m", "3d 2h", etc. */
export function formatDuration(from: string, to: string): string {
  const ms = new Date(to).getTime() - new Date(from).getTime()
  if (isNaN(ms) || ms < 0) return '—'
  const totalMin = Math.floor(ms / 60_000)
  const days = Math.floor(totalMin / 1440)
  const hours = Math.floor((totalMin % 1440) / 60)
  const mins = totalMin % 60
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${mins}m`
  return `${mins}m`
}

/** Format an ISO string or Date as "2026-04-05 21:18:07" */
export function formatDateTime(value: string | Date): string {
  const d = typeof value === 'string' ? new Date(value) : value
  if (isNaN(d.getTime())) return String(value)
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  )
}
