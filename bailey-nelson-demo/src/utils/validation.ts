// Clean validation schemas with Yup
import * as yup from 'yup'

export const checkoutSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),

  fullName: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Full name is required'),

  cardNumber: yup
    .string()
    .test('card-length', 'Card number must be 16 digits', function (value) {
      if (!value) return false
      // Remove spaces and check for exactly 16 digits
      const digitsOnly = value.replace(/\s/g, '')
      return /^\d{16}$/.test(digitsOnly)
    })
    .required('Card number is required'),

  expiryDate: yup
    .string()
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Invalid expiry date format (MM/YY)')
    .test('future-date', 'Expiry date must be in the future', function (value) {
      if (!value) return false

      const [month, year] = value.split('/')
      const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1)
      const now = new Date()

      return expiry > now
    })
    .required('Expiry date is required'),

  cvv: yup
    .string()
    .matches(/^\d{3,4}$/, 'CVV must be 3-4 digits')
    .required('CVV is required'),
})

// Initial form values
export const initialFormValues = {
  email: '',
  fullName: '',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
}

// Field configurations for consistent UI
export const fieldConfigs = {
  email: {
    label: 'Email Address',
    type: 'email' as const,
    placeholder: 'Enter your email',
    autoComplete: 'email',
  },
  fullName: {
    label: 'Full Name',
    type: 'text' as const,
    placeholder: 'Enter your full name',
    autoComplete: 'name',
  },
  cardNumber: {
    label: 'Card Number',
    type: 'tel' as const,
    placeholder: '1234 5678 9012 3456',
    maxLength: 19, // 16 digits + 3 spaces
    autoComplete: 'cc-number',
  },
  expiryDate: {
    label: 'Expiry Date',
    type: 'tel' as const,
    placeholder: 'MM/YY',
    maxLength: 5,
    autoComplete: 'cc-exp',
  },
  cvv: {
    label: 'CVV',
    type: 'tel' as const,
    placeholder: '123',
    maxLength: 4,
    autoComplete: 'cc-csc',
  },
} as const
