// Custom hook for API simulation with retry logic
import { useCallback } from 'react'
import { useApiActions, useApiStatus, useCanRetry } from '../store/apiStore'
import { useFormActions } from '../store/formStore'
import type { CheckoutFormData } from '../types/form.types'
import { simulateCheckoutAPI, simulateRetryAPI } from '../utils/apiSimulation'

export const useApiSimulation = () => {
  const apiActions = useApiActions()
  const apiStatus = useApiStatus()
  const canRetry = useCanRetry()
  const formActions = useFormActions()

  const submitForm = useCallback(
    async (formData: CheckoutFormData) => {
      try {
        // Reset API state and set loading
        apiActions.reset()
        apiActions.setLoading(true)
        formActions.setSubmitting(true)
        formActions.setError(null)

        // Simulate API call
        const result = await simulateCheckoutAPI(formData)

        if (result.success) {
          // Success case
          apiActions.setSuccess()
          formActions.setSuccess(true)
          return result
        } else {
          // Validation error case
          apiActions.setError(result.error || 'Validation failed')
          formActions.setError(result.error || 'Validation failed')
          return result
        }
      } catch (error) {
        // Network/server error case
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred'
        apiActions.setError(errorMessage)
        formActions.setError(errorMessage)
        throw error
      }
    },
    [apiActions, formActions]
  )

  const retrySubmit = useCallback(
    async (formData: CheckoutFormData) => {
      if (!canRetry) {
        throw new Error('Cannot retry: maximum retry attempts reached')
      }

      try {
        // Increment retry count
        apiActions.incrementRetry()
        formActions.setSubmitting(true)
        formActions.setError(null)

        // Simulate retry with exponential backoff
        const result = await simulateRetryAPI(formData, apiStatus.retryCount)

        if (result.success) {
          // Success case
          apiActions.resetRetry()
          formActions.setSuccess(true)
          return result
        } else {
          // Still failed after retry
          apiActions.setError(result.error || 'Retry failed')
          formActions.setError(result.error || 'Retry failed')
          return result
        }
      } catch (error) {
        // Network/server error still persists
        const errorMessage =
          error instanceof Error ? error.message : 'Retry failed'
        apiActions.setError(errorMessage)
        formActions.setError(errorMessage)
        throw error
      }
    },
    [apiActions, formActions, canRetry, apiStatus.retryCount]
  )

  const resetApiState = useCallback(() => {
    apiActions.reset()
    formActions.setError(null)
    formActions.setSuccess(false)
  }, [apiActions, formActions])

  // Get retry information
  const getRetryInfo = useCallback(() => {
    const maxRetries = 3
    const remainingRetries = Math.max(0, maxRetries - apiStatus.retryCount)
    const nextRetryDelay = Math.min(
      1000 * Math.pow(2, apiStatus.retryCount),
      5000
    )

    return {
      maxRetries,
      currentRetry: apiStatus.retryCount,
      remainingRetries,
      nextRetryDelay,
      canRetry,
    }
  }, [apiStatus.retryCount, canRetry])

  // Auto-retry functionality
  const autoRetry = useCallback(
    async (formData: CheckoutFormData) => {
      let lastError: Error | null = null
      let retryCount = 0

      while (retryCount < 3) {
        try {
          if (retryCount === 0) {
            return await submitForm(formData)
          } else {
            return await retrySubmit(formData)
          }
        } catch (error) {
          lastError =
            error instanceof Error ? error : new Error('Unknown error')
          retryCount++

          if (retryCount < 3) {
            // Wait before retrying
            const delay = Math.min(1000 * Math.pow(2, retryCount - 1), 5000)
            await new Promise((resolve) => setTimeout(resolve, delay))
          }
        }
      }

      // All retries failed
      throw lastError
    },
    [submitForm, retrySubmit]
  )

  return {
    submitForm,
    retrySubmit,
    resetApiState,
    getRetryInfo,
    autoRetry,
    // Expose current API status
    isLoading: apiStatus.isLoading,
    isRetrying: apiStatus.isRetrying,
    error: apiStatus.error,
    retryCount: apiStatus.retryCount,
    canRetry,
  }
}
