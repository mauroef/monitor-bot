import { useQuery } from '@tanstack/react-query'
import { tradingBotApi } from '../api/tradingBot'

export function useSignalHistory() {
  return useQuery({
    queryKey: ['trading', 'history'],
    queryFn: tradingBotApi.history,
    staleTime: 30_000,
  })
}
