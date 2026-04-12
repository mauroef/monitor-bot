import { useQuery } from '@tanstack/react-query'
import { gridBotApi } from '../api/gridBot'
import { tradingBotApi } from '../api/tradingBot'
import {
  adaptGridBotStatus,
  adaptGridBotBalances,
  adaptGridBotOrders,
  adaptGridBotMetrics,
  adaptTradingBotStatus,
  adaptTradingBotBalances,
  adaptTradingBotOrders,
  adaptTradingBotMetrics,
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

  const tradingStatus = useQuery({
    queryKey: ['trading', 'status'],
    queryFn: tradingBotApi.status,
  })

  const isLoading = gridStatus.isLoading || gridGrid.isLoading || tradingStatus.isLoading
  const gridErrors = [gridStatus.error, gridGrid.error].filter(Boolean) as Error[]
  const tradingErrors = [tradingStatus.error].filter(Boolean) as Error[]
  const errors = [...gridErrors, ...tradingErrors]

  // gridGrid may return { status: 'not_initialized' | 'PENDING_INIT' } with no account/levels
  const gridInitialized = gridGrid.data && gridGrid.data.status !== 'not_initialized' && gridGrid.data.status !== 'PENDING_INIT'

  let data: DashboardData | null = null

  const hasGrid = !!gridStatus.data
  const hasTrading = !!tradingStatus.data

  if (!hasGrid && !hasTrading) return { data, isLoading, errors }

  data = {
    bots: [
      ...(hasGrid ? [adaptGridBotStatus(gridStatus.data!)] : []),
      ...(hasTrading ? [adaptTradingBotStatus(tradingStatus.data!)] : []),
    ],
    balances: [
      ...(gridInitialized ? adaptGridBotBalances(gridGrid.data!) : []),
      ...(hasTrading ? adaptTradingBotBalances(tradingStatus.data!) : []),
    ],
    openOrders: [
      ...(gridInitialized ? adaptGridBotOrders(gridGrid.data!) : []),
      ...(hasTrading ? adaptTradingBotOrders(tradingStatus.data!) : []),
    ],
    metrics: [
      ...(hasGrid && gridGrid.data ? [adaptGridBotMetrics(gridStatus.data!, gridGrid.data)] : []),
      ...(hasTrading ? [adaptTradingBotMetrics(tradingStatus.data!)] : []),
    ],
  }

  return { data, isLoading, errors, gridErrors, tradingErrors }
}
