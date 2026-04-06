import { useDashboard } from './hooks/useDashboard'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { BotStatusCard } from './components/bots/BotStatusCard'
import { BalanceWidget } from './components/balances/BalanceWidget'
import { GridBalanceWidget } from './components/balances/GridBalanceWidget'
import { OrdersTable } from './components/orders/OrdersTable'
import { MetricsPanel } from './components/metrics/MetricsPanel'
import { CardSkeleton } from './components/ui/Skeleton'
import { GridBotLogCard, TradingBotLogCard } from './components/logs/BotLogCard'

export default function App() {
  const { data, isLoading, errors } = useDashboard()

  return (
    <DashboardLayout>
      {errors.length > 0 && (
        <div className="mb-6 space-y-2">
          {errors.map((err) => (
            <div
              key={err.message}
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400"
            >
              {err.message}
            </div>
          ))}
        </div>
      )}

      {isLoading && !data ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : data ? (
        <div className="space-y-6">
          <section className="grid gap-4 sm:grid-cols-2">
            {data.bots.map((bot) => (
              <BotStatusCard key={bot.botId} bot={bot} />
            ))}
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <GridBalanceWidget />
            <BalanceWidget />
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            {data.metrics.map((m) => (
              <MetricsPanel key={m.botType} metrics={m} />
            ))}
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <GridBotLogCard />
            <TradingBotLogCard />
          </section>

          <section>
            <OrdersTable orders={data.openOrders} />
          </section>
        </div>
      ) : null}
    </DashboardLayout>
  )
}
