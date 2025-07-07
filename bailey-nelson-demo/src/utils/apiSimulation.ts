// API simulation with multiple scenarios
import type { ApiResponse, ApiScenario } from '../types/api.types'
import type { CheckoutFormData } from '../types/form.types'

// Generate random order ID
const generateOrderId = (): string => {
  return Math.random().toString(36).substr(2, 9).toUpperCase()
}

// Default scenarios with weights for demo
const defaultScenarios: ApiScenario[] = [
  { type: 'success', weight: 0.6 },
  { type: 'validation_error', weight: 0.2 },
  { type: 'network_error', weight: 0.1 },
  { type: 'server_error', weight: 0.1 },
]

// Handle different scenario types
const handleScenario = (type: ApiScenario['type']): ApiResponse => {
  switch (type) {
    case 'success':
      return {
        success: true,
        data: { orderId: generateOrderId() },
      }

    case 'validation_error':
      return {
        success: false,
        error: 'Payment validation failed',
        fieldErrors: {
          cardNumber: 'This card number appears to be invalid',
        },
      }

    case 'network_error':
      throw new Error(
        'Network connection failed. Please check your internet connection.'
      )

    case 'server_error':
      throw new Error('Server temporarily unavailable. Please try again later.')

    default:
      return {
        success: true,
        data: { orderId: generateOrderId() },
      }
  }
}

// Select scenario based on weights
const selectScenario = (scenarios: ApiScenario[]): ApiScenario['type'] => {
  const random = Math.random()
  let cumulative = 0

  for (const scenario of scenarios) {
    cumulative += scenario.weight
    if (random <= cumulative) {
      return scenario.type
    }
  }

  // Fallback to success
  return 'success'
}

// Main API simulation function
export const simulateCheckoutAPI = async (
  _formData: CheckoutFormData,
  options: { delay?: number; scenarios?: ApiScenario[] } = {}
): Promise<ApiResponse> => {
  const { delay = 1500, scenarios = defaultScenarios } = options

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, delay))

  // Select and handle scenario
  const scenarioType = selectScenario(scenarios)
  return handleScenario(scenarioType)
}

// Simulate different API endpoints
export const simulateValidationAPI = async (
  field: keyof CheckoutFormData,
  value: string
): Promise<{ valid: boolean; error?: string }> => {
  // Simulate validation delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Simulate server-side validation
  if (field === 'email' && value === 'test@blocked.com') {
    return {
      valid: false,
      error: 'This email address is not allowed',
    }
  }

  if (
    field === 'cardNumber' &&
    value.replace(/\D/g, '') === '4000000000000002'
  ) {
    return {
      valid: false,
      error: 'This card has been declined',
    }
  }

  return { valid: true }
}

// Test different scenarios manually (for demo purposes)
export const testScenarios = {
  success: (formData: CheckoutFormData) =>
    simulateCheckoutAPI(formData, {
      scenarios: [{ type: 'success', weight: 1 }],
    }),

  validationError: (formData: CheckoutFormData) =>
    simulateCheckoutAPI(formData, {
      scenarios: [{ type: 'validation_error', weight: 1 }],
    }),

  networkError: (formData: CheckoutFormData) =>
    simulateCheckoutAPI(formData, {
      scenarios: [{ type: 'network_error', weight: 1 }],
    }),

  serverError: (formData: CheckoutFormData) =>
    simulateCheckoutAPI(formData, {
      scenarios: [{ type: 'server_error', weight: 1 }],
    }),
}
