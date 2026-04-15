import { useQuery } from '@tanstack/react-query'
import { gridBotApi } from '../api/gridBot'
import { signalBotApi } from '../api/signalBot'
import {
  adaptGridBotStatus,
  adaptGridBotBalances,
  adaptGridBotOrders,
  adaptGridBotMetrics,
  adaptSignalBotStatus,
  adaptSignalBotBalances,
  adaptSignalBotOrders,
  adaptSignalBotMetrics,
} from '../api/adapters'
import type { DashboardData } from '../types'

export function useDashboard() {
  const gridStatus = useQuery({
    queryKey: ['grid', 'status'],
    queryFn: gridBotApi.status,
  })

  const gridGrid = useQuery({
    queryKey: ['grid', 'grid'],
    queryFn: gridBotApi.grid,
  })

  const signalStatus = useQuery({
    queryKey: ['signal', 'status'],
    queryFn: signalBotApi.status,
  })

  const isLoading = gridStatus.isLoading || gridGrid.isLoading || signalStatus.isLoading
  const gridErrors = [gridStatus.error, gridGrid.error].filter(Boolean) as Error[]
  const signalErrors = [signalStatus.error].filter(Boolean) as Error[]
  const errors = [...gridErrors, ...signalErrors]

  // gridGrid may return { status: 'not_initialized' | 'PENDING_INIT' } with no account/levels
  const gridInitialized = gridGrid.data && gridGrid.data.status !== 'not_initialized' && gridGrid.data.status !== 'PENDING_INIT'

  let data: DashboardData | null = null

  const hasGrid = !!gridStatus.data
  const hasSignal = !!signalStatus.data

  if (!hasGrid && !hasSignal) return { data, isLoading, errors }

  data = {
    bots: [
      ...(hasGrid ? [adaptGridBotStatus(gridStatus.data!)] : []),
      ...(hasSignal ? [adaptSignalBotStatus(signalStatus.data!)] : []),
    ],
    balances: [
      ...(gridInitialized ? adaptGridBotBalances(gridGrid.data!) : []),
      ...(hasSignal ? adaptSignalBotBalances(signalStatus.data!) : []),
    ],
    openOrders: [
      ...(gridInitialized ? adaptGridBotOrders(gridGrid.data!) : []),
      ...(hasSignal ? adaptSignalBotOrders(signalStatus.data!) : []),
    ],
    metrics: [
      ...(hasGrid && gridGrid.data ? [adaptGridBotMetrics(gridStatus.data!, gridGrid.data)] : []),
      ...(hasSignal ? [adaptSignalBotMetrics(signalStatus.data!)] : []),
    ],
  }

  return { data, isLoading, errors, gridErrors, signalErrors }
}
