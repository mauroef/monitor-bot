import { useDashboard } from './hooks/useDashboard'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { BotSection } from './components/layout/BotSection'
import { BotStatusCard } from './components/bots/BotStatusCard'
import { BalanceWidget } from './components/balances/BalanceWidget'
import { GridBalanceWidget } from './components/balances/GridBalanceWidget'
import { OrdersTable } from './components/orders/OrdersTable'
import { MetricsPanel } from './components/metrics/MetricsPanel'
import { CardSkeleton } from './components/ui/Skeleton'
import { GridCard } from './components/grid/GridCard'
import { GridBotLogCard, SignalBotLogCard } from './components/logs/BotLogCard'
import { TradeHistoryCard } from './components/history/TradeHistoryCard'
import { GridResetButton } from './components/bots/GridResetButton'

export default function App() {
  const { data, isLoading, gridErrors, signalErrors } = useDashboard()

  return (
    <DashboardLayout>
      {isLoading && !data ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : data ? (
        <div className="space-y-4">
          <BotSection
            title="grid-bot"
            storageKey="section-grid"
            bot={data.bots.find((b) => b.botType === 'grid')}
            errors={gridErrors}
            actions={<GridResetButton />}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {data.bots
                .filter((b) => b.botType === 'grid')
                .map((bot) => (
                  <BotStatusCard key={bot.botId} bot={bot} />
                ))}
              <GridBalanceWidget />
            </div>
            {data.metrics
              .filter((m) => m.botType === 'grid')
              .map((m) => (
                <MetricsPanel key={m.botType} metrics={m} />
              ))}
            <GridCard />
            <GridBotLogCard />
            <OrdersTable storageKey="orders-grid" orders={data.openOrders.filter((o) => o.botType === 'grid')} />
          </BotSection>

          <BotSection
            title="signal-bot"
            storageKey="section-signal"
            bot={data.bots.find((b) => b.botType === 'signal')}
            errors={signalErrors}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {data.bots
                .filter((b) => b.botType === 'signal')
                .map((bot) => (
                  <BotStatusCard key={bot.botId} bot={bot} />
                ))}
              <BalanceWidget />
            </div>
            {data.metrics
              .filter((m) => m.botType === 'signal')
              .map((m) => (
                <MetricsPanel key={m.botType} metrics={m} />
              ))}
            <SignalBotLogCard />
            <OrdersTable storageKey="orders-signal" orders={data.openOrders.filter((o) => o.botType === 'signal')} showSlTp />
            <TradeHistoryCard />
          </BotSection>
        </div>
      ) : null}
    </DashboardLayout>
  )
}
