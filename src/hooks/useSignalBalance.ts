import { useQuery } from '@tanstack/react-query'
import { signalBotApi } from '../api/signalBot'

export function useSignalBalance() {
  return useQuery({
    queryKey: ['signal', 'balance'],
    queryFn: signalBotApi.balance,
    staleTime: 60_000,
    retry: 1,
  })
}
