// Credit card formatting utilities
export const formatCardNumber = (value: string): string => {
  // Remove all non-digits
  const cleaned = value.replace(/\D/g, '')

  // Add spaces every 4 digits
  const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ')

  // Limit to 16 digits (19 characters with spaces)
  return formatted.substring(0, 19)
}

export const formatExpiryDate = (value: string): string => {
  const cleaned = value.replace(/\D/g, '')

  if (cleaned.length >= 2) {
    return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4)
  }

  return cleaned
}

export const formatCvv = (value: string): string => {
  // Only allow digits and limit to 4 characters
  return value.replace(/\D/g, '').substring(0, 4)
}

export const maskCardNumber = (value: string): string => {
  // Remove formatting first
  const cleaned = value.replace(/\D/g, '')

  if (cleaned.length <= 4) {
    return formatCardNumber(cleaned)
  }

  // Mask all but last 4 digits
  const masked =
    cleaned.substring(0, cleaned.length - 4).replace(/\d/g, '•') +
    cleaned.substring(cleaned.length - 4)

  return formatCardNumber(masked)
}

export const maskCvv = (value: string): string => {
  return value.replace(/\d/g, '•')
}

export const unformatCardNumber = (value: string): string => {
  return value.replace(/\D/g, '')
}

export const validateCardNumber = (value: string): boolean => {
  const cleaned = unformatCardNumber(value)
  return cleaned.length === 16 && /^\d{16}$/.test(cleaned)
}

export const validateExpiryDate = (value: string): boolean => {
  const match = value.match(/^(0[1-9]|1[0-2])\/\d{2}$/)
  if (!match) return false

  const [month, year] = value.split('/')
  const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1)
  const now = new Date()

  return expiry > now
}

export const validateCvv = (value: string): boolean => {
  return /^\d{3,4}$/.test(value)
}

export const getCardType = (cardNumber: string): string => {
  const cleaned = unformatCardNumber(cardNumber)

  if (cleaned.startsWith('4')) return 'visa'
  if (cleaned.startsWith('5') || cleaned.startsWith('2')) return 'mastercard'
  if (cleaned.startsWith('3')) return 'amex'
  if (cleaned.startsWith('6')) return 'discover'

  return 'unknown'
}
