// Simple API response types
import type { CheckoutFormData } from './form.types'

export interface ApiResponse {
  success: boolean
  data?: {
    orderId: string
  }
  error?: string
  fieldErrors?: Partial<Record<keyof CheckoutFormData, string>>
}

export interface ApiState {
  isLoading: boolean
  error: string | null

  // Actions
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

export interface ApiSimulationOptions {
  delay?: number
  scenarios?: ApiScenario[]
}

export interface ApiScenario {
  type: 'success' | 'validation_error' | 'network_error' | 'server_error'
  weight: number
}
