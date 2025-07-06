// Custom hook for form persistence with localStorage
import { useCallback, useEffect } from 'react'
import { useFormActions, useFormStatus, useFormStore } from '../store/formStore'

export const useFormPersistence = () => {
  const formStore = useFormStore()
  const formActions = useFormActions()
  const formStatus = useFormStatus()

  // Load persisted data on component mount
  useEffect(() => {
    formActions.loadPersistedForm()
  }, [formActions])

  // Auto-save form data when it changes
  useEffect(() => {
    if (formStatus.isDirty) {
      formActions.persistForm()
    }
  }, [formStore.formData, formStatus.isDirty, formActions])

  // Manual persistence controls
  const saveFormData = useCallback(() => {
    formActions.persistForm()
  }, [formActions])

  const clearPersistedData = useCallback(() => {
    localStorage.removeItem('checkout-form-storage')
    formActions.resetForm()
  }, [formActions])

  const hasPersistedData = useCallback(() => {
    const stored = localStorage.getItem('checkout-form-storage')
    if (!stored) return false

    try {
      const parsed = JSON.parse(stored)
      return (
        parsed.state &&
        (parsed.state.formData?.email ||
          parsed.state.formData?.fullName ||
          parsed.state.formData?.cardNumber ||
          parsed.state.formData?.expiryDate ||
          parsed.state.formData?.cvv)
      )
    } catch {
      return false
    }
  }, [])

  const getPersistedFormData = useCallback(() => {
    const stored = localStorage.getItem('checkout-form-storage')
    if (!stored) return null

    try {
      const parsed = JSON.parse(stored)
      return parsed.state?.formData || null
    } catch {
      return null
    }
  }, [])

  // Get persistence status
  const getPersistenceInfo = useCallback(() => {
    const hasData = hasPersistedData()
    const lastSaved = formStatus.lastSavedAt
    const isAutoSaving = formStatus.isDirty

    return {
      hasPersistedData: hasData,
      lastSavedAt: lastSaved,
      isAutoSaving,
      formattedLastSaved: lastSaved
        ? new Date(lastSaved).toLocaleString()
        : null,
    }
  }, [hasPersistedData, formStatus.lastSavedAt, formStatus.isDirty])

  // Restore form from specific data
  const restoreFormData = useCallback(
    (data: unknown) => {
      if (data && typeof data === 'object') {
        formActions.updateFormData(data as Record<string, string>)
      }
    },
    [formActions]
  )

  // Export current form data
  const exportFormData = useCallback(() => {
    return {
      formData: formStore.formData,
      exportedAt: new Date().toISOString(),
      isDirty: formStatus.isDirty,
      lastSavedAt: formStatus.lastSavedAt,
    }
  }, [formStore.formData, formStatus.isDirty, formStatus.lastSavedAt])

  // Show confirmation dialog before clearing
  const confirmClearData = useCallback(() => {
    if (hasPersistedData()) {
      const confirmed = window.confirm(
        'Are you sure you want to clear all saved form data? This action cannot be undone.'
      )
      if (confirmed) {
        clearPersistedData()
        return true
      }
      return false
    }
    return true
  }, [hasPersistedData, clearPersistedData])

  return {
    // Core functionality
    saveFormData,
    clearPersistedData,
    hasPersistedData,
    getPersistedFormData,
    restoreFormData,

    // Status and info
    getPersistenceInfo,
    exportFormData,
    confirmClearData,

    // Current state
    isDirty: formStatus.isDirty,
    lastSavedAt: formStatus.lastSavedAt,
    isAutoSaving: formStatus.isDirty,
  }
}
