// Form store with Zustand + persistence
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import type { CheckoutFormData, FormState } from '../types/form.types'

const initialFormData: CheckoutFormData = {
  email: '',
  fullName: '',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
}

interface FormStore extends FormState {
  // Additional store-specific properties
  lastSavedAt: number | null
}

export const useFormStore = create<FormStore>()(
  persist(
    (set, get) => ({
      // Initial state
      formData: initialFormData,
      isDirty: false,
      isSubmitting: false,
      submitError: null,
      submitSuccess: false,
      lastSavedAt: null,

      // Actions
      updateFormData: (data: Partial<CheckoutFormData>) => {
        set((state) => ({
          formData: { ...state.formData, ...data },
          isDirty: true,
          submitError: null, // Clear previous errors
          submitSuccess: false,
          lastSavedAt: Date.now(),
        }))
      },

      setSubmitting: (isSubmitting: boolean) => {
        set({ isSubmitting })
      },

      setError: (error: string | null) => {
        set({
          submitError: error,
          isSubmitting: false,
          submitSuccess: false,
        })
      },

      setSuccess: (success: boolean) => {
        set({
          submitSuccess: success,
          isSubmitting: false,
          submitError: null,
        })
      },

      resetForm: () => {
        set({
          formData: initialFormData,
          isDirty: false,
          isSubmitting: false,
          submitError: null,
          submitSuccess: false,
          lastSavedAt: null,
        })
      },

      persistForm: () => {
        const state = get()
        if (state.isDirty) {
          set({ lastSavedAt: Date.now() })
        }
      },

      loadPersistedForm: () => {
        // This is handled automatically by Zustand persist middleware
        // But we can trigger additional logic here if needed
        const state = get()
        if (state.formData.email || state.formData.fullName) {
          set({ isDirty: true })
        }
      },
    }),
    {
      name: 'checkout-form-storage',
      // Only persist form data and relevant state
      partialize: (state) => ({
        formData: state.formData,
        isDirty: state.isDirty,
        lastSavedAt: state.lastSavedAt,
      }),
    }
  )
)

// Utility functions for working with form store
export const useFormActions = () => {
  return useFormStore(
    useShallow((state) => ({
      updateFormData: state.updateFormData,
      setSubmitting: state.setSubmitting,
      setError: state.setError,
      setSuccess: state.setSuccess,
      resetForm: state.resetForm,
      persistForm: state.persistForm,
      loadPersistedForm: state.loadPersistedForm,
    }))
  )
}

export const useFormData = () => {
  return useFormStore((state) => state.formData)
}

export const useFormStatus = () => {
  return useFormStore(
    useShallow((state) => ({
      isDirty: state.isDirty,
      isSubmitting: state.isSubmitting,
      submitError: state.submitError,
      submitSuccess: state.submitSuccess,
      lastSavedAt: state.lastSavedAt,
    }))
  )
}
