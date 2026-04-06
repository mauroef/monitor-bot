import { useCallback, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

const TOTAL = 30

export function useRefreshCountdown() {
  const queryClient = useQueryClient()
  const [countdown, setCountdown] = useState(TOTAL)

  useEffect(() => {
    const id = setInterval(() => {
      setCountdown((c) => (c <= 1 ? TOTAL : c - 1))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const refresh = useCallback(() => {
    queryClient.invalidateQueries()
    setCountdown(TOTAL)
  }, [queryClient])

  return { countdown, total: TOTAL, refresh }
}
