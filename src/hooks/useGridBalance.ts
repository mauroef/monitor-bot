import { useQuery } from '@tanstack/react-query'
import { gridBotApi } from '../api/gridBot'

export function useGridBalance() {
  return useQuery({
    queryKey: ['grid', 'grid'], // misma key que useDashboard → no re-fetcha
    queryFn: gridBotApi.grid,
    staleTime: 15_000,
  })
}
