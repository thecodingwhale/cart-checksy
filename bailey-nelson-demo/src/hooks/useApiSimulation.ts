// Custom hook for API simulation using TanStack Query
import { useMutation } from '@tanstack/react-query'
import { useFormActions } from '../store/formStore'
import type { CheckoutFormData } from '../types/form.types'
import { simulateCheckoutAPI } from '../utils/apiSimulation'

export const useApiSimulation = () => {
  const formActions = useFormActions()

  // Checkout form submission mutation
  const checkoutMutation = useMutation({
    mutationFn: simulateCheckoutAPI,
    onMutate: () => {
      // Clear previous form errors when starting submission
      formActions.setError(null)
      formActions.setSubmitting(true)
    },
    onSuccess: (data) => {
      // Handle successful submission
      formActions.setSuccess(true)
      formActions.setSubmitting(false)
      console.log('Order submitted successfully:', data.data?.orderId)
    },
    onError: (error) => {
      // Handle submission errors
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred'
      formActions.setError(errorMessage)
      formActions.setSubmitting(false)
      console.error('Submission error:', error)
    },
    onSettled: () => {
      // Always reset submitting state regardless of success/error
      formActions.setSubmitting(false)
    },
  })

  // Submit form function
  const submitForm = (formData: CheckoutFormData) => {
    return checkoutMutation.mutateAsync(formData)
  }

  // Reset API state
  const resetApiState = () => {
    checkoutMutation.reset()
    formActions.setError(null)
    formActions.setSuccess(false)
    formActions.setSubmitting(false)
  }

  return {
    submitForm,
    resetApiState,
    // TanStack Query provides these states automatically
    isLoading: checkoutMutation.isPending,
    error: checkoutMutation.error?.message || null,
    isSuccess: checkoutMutation.isSuccess,
    isError: checkoutMutation.isError,
    // Access to the mutation object for advanced use cases
    mutation: checkoutMutation,
  }
}
