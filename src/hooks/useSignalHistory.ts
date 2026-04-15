import { useQuery } from '@tanstack/react-query'
import { signalBotApi } from '../api/signalBot'

export function useSignalHistory() {
  return useQuery({
    queryKey: ['signal', 'history'],
    queryFn: signalBotApi.history,
    staleTime: 30_000,
  })
}
