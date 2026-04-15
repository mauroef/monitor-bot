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
