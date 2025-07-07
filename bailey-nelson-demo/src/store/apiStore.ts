// API store
import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import type { ApiState } from '../types/api.types'

interface ApiStore extends ApiState {
  // Additional store-specific properties
  lastError: string | null
  lastSuccessAt: number | null

  // Additional utility actions
  reset: () => void
  setSuccess: () => void
}

export const useApiStore = create<ApiStore>()((set) => ({
  // Initial state
  isLoading: false,
  error: null,
  lastError: null,
  lastSuccessAt: null,

  // Actions
  setLoading: (isLoading: boolean) => {
    set({ isLoading })
  },

  setError: (error: string | null) => {
    set({
      error,
      isLoading: false,
      lastError: error,
    })
  },

  // Additional utility actions
  reset: () => {
    set({
      isLoading: false,
      error: null,
      lastError: null,
    })
  },

  setSuccess: () => {
    set({
      isLoading: false,
      error: null,
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
      lastError: state.lastError,
      lastSuccessAt: state.lastSuccessAt,
    }))
  )
}
