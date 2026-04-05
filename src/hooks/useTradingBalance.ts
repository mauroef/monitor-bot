import { useQuery } from '@tanstack/react-query'
import { tradingBotApi } from '../api/tradingBot'

export function useTradingBalance() {
  return useQuery({
    queryKey: ['trading', 'balance'],
    queryFn: tradingBotApi.balance,
    staleTime: 60_000,
    retry: 1,
  })
}
