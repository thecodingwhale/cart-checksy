// Custom hook for API simulation
import { useCallback } from 'react'
import { useApiActions, useApiStatus } from '../store/apiStore'
import { useFormActions } from '../store/formStore'
import type { CheckoutFormData } from '../types/form.types'
import { simulateCheckoutAPI } from '../utils/apiSimulation'

export const useApiSimulation = () => {
  const apiActions = useApiActions()
  const apiStatus = useApiStatus()
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

  const resetApiState = useCallback(() => {
    apiActions.reset()
    formActions.setError(null)
    formActions.setSuccess(false)
  }, [apiActions, formActions])

  return {
    submitForm,
    resetApiState,
    // Expose current API status
    isLoading: apiStatus.isLoading,
    error: apiStatus.error,
  }
}
