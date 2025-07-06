// Clean, straightforward TypeScript types for forms
export interface CheckoutFormData {
  email: string
  fullName: string
  cardNumber: string
  expiryDate: string
  cvv: string
}

export interface FormFieldProps {
  name: keyof CheckoutFormData
  label: string
  type: 'text' | 'email' | 'tel'
  placeholder?: string
  maxLength?: number
  autoComplete?: string
}

export interface FormState {
  // Form data
  formData: CheckoutFormData
  isDirty: boolean

  // Submission state
  isSubmitting: boolean
  submitError: string | null
  submitSuccess: boolean

  // Actions
  updateFormData: (data: Partial<CheckoutFormData>) => void
  setSubmitting: (isSubmitting: boolean) => void
  setError: (error: string | null) => void
  setSuccess: (success: boolean) => void
  resetForm: () => void

  // Persistence
  persistForm: () => void
  loadPersistedForm: () => void
}

export interface FormValidationErrors {
  [key: string]: string | undefined
}

export interface FormTouched {
  [key: string]: boolean | undefined
}
