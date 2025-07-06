// Custom hook for credit card formatting
import { useCallback } from 'react'
import {
  formatCardNumber,
  formatCvv,
  formatExpiryDate,
  getCardType,
  maskCardNumber,
  maskCvv,
  unformatCardNumber,
  validateCardNumber,
  validateCvv,
  validateExpiryDate,
} from '../utils/cardFormatting'

export const useCardFormatting = () => {
  const formatField = useCallback((field: string, value: string): string => {
    switch (field) {
      case 'cardNumber':
        return formatCardNumber(value)
      case 'expiryDate':
        return formatExpiryDate(value)
      case 'cvv':
        return formatCvv(value)
      default:
        return value
    }
  }, [])

  const maskField = useCallback((field: string, value: string): string => {
    switch (field) {
      case 'cardNumber':
        return maskCardNumber(value)
      case 'cvv':
        return maskCvv(value)
      default:
        return value
    }
  }, [])

  const validateField = useCallback((field: string, value: string): boolean => {
    switch (field) {
      case 'cardNumber':
        return validateCardNumber(value)
      case 'expiryDate':
        return validateExpiryDate(value)
      case 'cvv':
        return validateCvv(value)
      default:
        return true
    }
  }, [])

  const getCardBrand = useCallback((cardNumber: string): string => {
    return getCardType(cardNumber)
  }, [])

  const getCleanValue = useCallback((field: string, value: string): string => {
    if (field === 'cardNumber') {
      return unformatCardNumber(value)
    }
    return value
  }, [])

  // Format handler for form inputs
  const handleInputChange = useCallback(
    (
      field: string,
      value: string,
      onChange: (field: string, value: string) => void
    ) => {
      const formatted = formatField(field, value)
      onChange(field, formatted)
    },
    [formatField]
  )

  // Get field configuration for different card types
  const getFieldConfig = useCallback((field: string) => {
    switch (field) {
      case 'cardNumber':
        return {
          maxLength: 19, // 16 digits + 3 spaces
          pattern: '[0-9 ]*',
          inputMode: 'numeric' as const,
        }
      case 'expiryDate':
        return {
          maxLength: 5, // MM/YY
          pattern: '[0-9/]*',
          inputMode: 'numeric' as const,
        }
      case 'cvv':
        return {
          maxLength: 4,
          pattern: '[0-9]*',
          inputMode: 'numeric' as const,
        }
      default:
        return {}
    }
  }, [])

  return {
    formatField,
    maskField,
    validateField,
    getCardBrand,
    getCleanValue,
    handleInputChange,
    getFieldConfig,
  }
}
