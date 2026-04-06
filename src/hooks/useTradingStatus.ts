import { useQuery } from '@tanstack/react-query'
import { tradingBotApi } from '../api/tradingBot'

export function useTradingStatus() {
  return useQuery({
    queryKey: ['trading', 'status'],
    queryFn: tradingBotApi.status,
  })
}
