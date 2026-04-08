import { useDashboard } from './hooks/useDashboard'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { BotSection } from './components/layout/BotSection'
import { BotStatusCard } from './components/bots/BotStatusCard'
import { BalanceWidget } from './components/balances/BalanceWidget'
import { GridBalanceWidget } from './components/balances/GridBalanceWidget'
import { OrdersTable } from './components/orders/OrdersTable'
import { MetricsPanel } from './components/metrics/MetricsPanel'
import { CardSkeleton } from './components/ui/Skeleton'
import { GridBotLogCard, TradingBotLogCard } from './components/logs/BotLogCard'
import { TradeHistoryCard } from './components/history/TradeHistoryCard'

export default function App() {
  const { data, isLoading, gridErrors, tradingErrors } = useDashboard()

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
            <GridBotLogCard />
            <OrdersTable orders={data.openOrders.filter((o) => o.botType === 'grid')} />
          </BotSection>

          <BotSection
            title="signal-bot"
            storageKey="section-trading"
            bot={data.bots.find((b) => b.botType === 'trading')}
            errors={tradingErrors}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {data.bots
                .filter((b) => b.botType === 'trading')
                .map((bot) => (
                  <BotStatusCard key={bot.botId} bot={bot} />
                ))}
              <BalanceWidget />
            </div>
            {data.metrics
              .filter((m) => m.botType === 'trading')
              .map((m) => (
                <MetricsPanel key={m.botType} metrics={m} />
              ))}
            <TradingBotLogCard />
            <OrdersTable orders={data.openOrders.filter((o) => o.botType === 'trading')} />
            <TradeHistoryCard />
          </BotSection>
        </div>
      ) : null}
    </DashboardLayout>
  )
}
