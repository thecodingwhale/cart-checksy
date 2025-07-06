// API store with retry logic
import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import type { ApiState } from '../types/api.types'

interface ApiStore extends ApiState {
  // Additional store-specific properties
  lastError: string | null
  lastSuccessAt: number | null
  totalRetries: number

  // Additional utility actions
  reset: () => void
  setSuccess: () => void
}

export const useApiStore = create<ApiStore>()((set) => ({
  // Initial state
  isLoading: false,
  error: null,
  retryCount: 0,
  isRetrying: false,
  lastError: null,
  lastSuccessAt: null,
  totalRetries: 0,

  // Actions
  setLoading: (isLoading: boolean) => {
    set({ isLoading })
  },

  setError: (error: string | null) => {
    set({
      error,
      isLoading: false,
      isRetrying: false,
      lastError: error,
    })
  },

  incrementRetry: () => {
    set((state) => ({
      retryCount: state.retryCount + 1,
      totalRetries: state.totalRetries + 1,
      isRetrying: true,
    }))
  },

  resetRetry: () => {
    set({
      retryCount: 0,
      isRetrying: false,
      error: null,
      lastSuccessAt: Date.now(),
    })
  },

  setRetrying: (isRetrying: boolean) => {
    set({ isRetrying })
  },

  // Additional utility actions
  reset: () => {
    set({
      isLoading: false,
      error: null,
      retryCount: 0,
      isRetrying: false,
      lastError: null,
    })
  },

  setSuccess: () => {
    set({
      isLoading: false,
      error: null,
      retryCount: 0,
      isRetrying: false,
      lastSuccessAt: Date.now(),
    })
  },
}))

// Utility hooks for working with API store
export const useApiActions = () => {
  return useApiStore(
    useShallow((state) => ({
      setLoading: state.setLoading,
      setError: state.setError,
      incrementRetry: state.incrementRetry,
      resetRetry: state.resetRetry,
      setRetrying: state.setRetrying,
      reset: state.reset,
      setSuccess: state.setSuccess,
    }))
  )
}

export const useApiStatus = () => {
  return useApiStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      error: state.error,
      retryCount: state.retryCount,
      isRetrying: state.isRetrying,
      lastError: state.lastError,
      lastSuccessAt: state.lastSuccessAt,
      totalRetries: state.totalRetries,
    }))
  )
}

// Computed values
export const useCanRetry = () => {
  return useApiStore((state) => state.retryCount < 3 && !state.isRetrying)
}

export const useIsProcessing = () => {
  return useApiStore((state) => state.isLoading || state.isRetrying)
}
