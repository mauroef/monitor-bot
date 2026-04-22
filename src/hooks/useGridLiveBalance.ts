import { useQuery } from '@tanstack/react-query'
import { gridBotApi } from '../api/gridBot'

export function useGridLiveBalance() {
  return useQuery({
    queryKey: ['grid', 'balance'],
    queryFn: gridBotApi.balance,
    staleTime: 60_000,
    retry: 1,
  })
}
