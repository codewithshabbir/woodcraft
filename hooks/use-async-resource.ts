"use client"

import { useCallback, useEffect, useState } from "react"

type UseAsyncResourceOptions<T> = {
  loader: () => Promise<T>
  initialData?: T | null
}

export function useAsyncResource<T>({ loader, initialData = null }: UseAsyncResourceOptions<T>) {
  const [data, setData] = useState<T | null>(initialData)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(initialData === null)

  const load = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const nextData = await loader()
      setData(nextData)
    } catch {
      setError("Something went wrong while loading data.")
    } finally {
      setIsLoading(false)
    }
  }, [loader])

  useEffect(() => {
    void load()
  }, [load])

  return {
    data,
    error,
    isLoading,
    reload: load,
  }
}
