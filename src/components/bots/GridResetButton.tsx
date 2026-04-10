import { useMutation, useQueryClient } from '@tanstack/react-query'
import { gridBotApi } from '../../api/gridBot'

export function GridResetButton() {
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: gridBotApi.reset,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['grid'] })
    },
  })

  const handleClick = () => {
    if (!window.confirm('Reset the grid? This will cancel all open orders and restart on the next cycle.')) return
    mutate()
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="shrink-0 rounded-md px-2.5 py-1 text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 disabled:opacity-50 transition-colors"
    >
      {isPending ? '…' : 'Reset'}
    </button>
  )
}
