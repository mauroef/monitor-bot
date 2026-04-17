import { Columns2 } from 'lucide-react'
import { useDashboard } from './hooks/useDashboard'
import { useLocalStorage } from './hooks/useLocalStorage'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { BotSection } from './components/layout/BotSection'
import { BotStatusCard } from './components/bots/BotStatusCard'
import { BalanceWidget } from './components/balances/BalanceWidget'
import { GridBalanceWidget } from './components/balances/GridBalanceWidget'
import { OrdersTable } from './components/orders/OrdersTable'
import { MetricsPanel } from './components/metrics/MetricsPanel'
import { CardSkeleton } from './components/ui/Skeleton'
import { GridCard } from './components/grid/GridCard'
import { GridTradeHistoryCard } from './components/history/GridTradeHistoryCard'
import { GridBotLogCard, SignalBotLogCard } from './components/logs/BotLogCard'
import { TradeHistoryCard } from './components/history/TradeHistoryCard'
import { GridResetButton } from './components/bots/GridResetButton'

export default function App() {
  const { data, isLoading, gridErrors, signalErrors } = useDashboard()
  const [sideBySide, setSideBySide] = useLocalStorage('layout-side-by-side', false)

  const toggleButton = (
    <button
      onClick={() => setSideBySide(!sideBySide)}
      title={sideBySide ? 'Stack sections' : 'Show side by side'}
      className={`hidden xl:flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors ${
        sideBySide
          ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
          : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700/50'
      }`}
    >
      <Columns2 className="size-3.5" />
      <span>side by side</span>
    </button>
  )

  return (
    <DashboardLayout headerActions={toggleButton}>
      {isLoading && !data ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : data ? (
        <div className={sideBySide ? 'flex flex-col gap-4 xl:grid xl:grid-cols-2 xl:items-start xl:gap-4' : 'space-y-4'}>
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
            <OrdersTable storageKey="orders-signal" orders={data.openOrders.filter((o) => o.botType === 'signal')} showSlTp />
            <TradeHistoryCard />
            <SignalBotLogCard />
          </BotSection>

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
            <GridTradeHistoryCard />
            <OrdersTable storageKey="orders-grid" orders={data.openOrders.filter((o) => o.botType === 'grid')} />
            <GridBotLogCard />
          </BotSection>
        </div>
      ) : null}
    </DashboardLayout>
  )
}
