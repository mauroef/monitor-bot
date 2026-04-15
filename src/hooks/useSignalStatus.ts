import { useQuery } from '@tanstack/react-query'
import { signalBotApi } from '../api/signalBot'

export function useSignalStatus() {
  return useQuery({
    queryKey: ['signal', 'status'],
    queryFn: signalBotApi.status,
  })
}
