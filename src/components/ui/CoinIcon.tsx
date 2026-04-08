import btcSvg from 'cryptocurrency-icons/svg/color/btc.svg'
import ethSvg from 'cryptocurrency-icons/svg/color/eth.svg'
import solSvg from 'cryptocurrency-icons/svg/color/sol.svg'
import bnbSvg from 'cryptocurrency-icons/svg/color/bnb.svg'

const icons: Record<string, string> = {
  BTC: btcSvg,
  ETH: ethSvg,
  SOL: solSvg,
  BNB: bnbSvg,
}

interface CoinIconProps {
  asset: string
  className?: string
}

export function CoinIcon({ asset, className = 'size-6' }: CoinIconProps) {
  const src = icons[asset.toUpperCase()]
  if (!src) return null
  return <img src={src} alt={asset.toUpperCase()} className={className} />
}
