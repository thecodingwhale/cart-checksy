# Bailey Nelson Live Coding Interview - Comprehensive Architecture (Updated)

## Overview

**35-40 minute live coding session** (30 minutes + buffer) focused on demonstrating **broad technical skills** across multiple areas with **deep dive into forms, state management, and validation**. This session will showcase both the development process and final working product.

## Updated Strategy

### Core Philosophy

- **Ambitious scope with smart preparation** - Pre-setup boilerplate to maximize demo time
- **Show both process and result** - Demonstrate thinking and implementation
- **All features are must-haves** - Risk ambitious scope for comprehensive demonstration
- **Clean, straightforward code** - Focus on clarity over complexity

### Preparation Strategy

- **Pre-setup Vite + React + TypeScript project** with basic dependencies
- **Boilerplate components structure** ready to implement
- **Fallback plan** - Progressive feature implementation with core features first
- **Practice session** - Dry run the entire demo beforehand

## Technical Stack

### Core Technologies

- **React 18** with TypeScript (clean, straightforward typing)
- **Vite** (build tool - matches Bailey Nelson's setup)
- **Formik** (form management - with built-in validation)
- **Zustand** (state management) + **custom hooks**
- **Tailwind CSS** (minimal styling - basic functional approach)
- **TypeScript** (clean and straightforward, no advanced generics)

### Development Tools

- ESLint + Prettier for code quality
- React DevTools for debugging (if needed)

## Project Structure

```
src/
├── components/
│   ├── ui/                     # Reusable UI components
│   │   ├── Input.tsx           # With credit card formatting
│   │   ├── Button.tsx          # With loading states
│   │   └── ErrorMessage.tsx    # Clean error display
│   ├── forms/                  # Form-specific components
│   │   └── CheckoutForm.tsx    # Simplified 4-5 fields
│   └── layout/                 # Layout components
│       └── FormContainer.tsx
├── hooks/                      # Custom hooks
│   ├── useFormPersistence.ts   # LocalStorage integration
│   ├── useApiSimulation.ts     # API scenarios + retry logic
│   └── useCardFormatting.ts    # Credit card formatting
├── store/                      # Zustand store
│   ├── formStore.ts            # Form state + persistence
│   └── apiStore.ts             # API state + error handling
├── types/                      # TypeScript type definitions
│   ├── form.types.ts           # Clean, straightforward types
│   └── api.types.ts            # Simple API response types
├── utils/                      # Utility functions
│   ├── validation.ts           # Formik validation schemas
│   ├── apiSimulation.ts        # Multiple scenarios
│   └── cardFormatting.ts       # Credit card utilities
└── App.tsx
```

## Simplified Form Design (4-5 Fields)

### Form Fields

1. **Email** - Email validation + real-time feedback
2. **Full Name** - Required field validation
3. **Credit Card Number** - Formatting + masking + validation
4. **Expiry Date** - MM/YY format + future date validation
5. **CVV** - 3-4 digit validation + masking

### Must-Have Features

- **Form validation** - Real-time with Formik
- **API simulation** - Success/error/loading scenarios
- **Error handling + retry logic** - Network error recovery
- **Form persistence** - LocalStorage integration
- **Loading states + UX polish** - Smooth user experience
- **Credit card formatting** - Live formatting as user types

## Component Architecture

### Smart vs Dumb Components

**Smart Components (Containers)**

- `CheckoutFormContainer` - Handles form state, validation, and API calls
- `UserRegistrationContainer` - Manages registration flow and user state

**Dumb Components (Presentational)**

- `Input` - Reusable input component with validation display
- `Button` - Styled button with loading states
- `ErrorMessage` - Consistent error display
- `FormField` - Wrapper for form inputs with labels

### Component Hierarchy

```
App
├── FormContainer (Layout)
    ├── CheckoutFormContainer (Smart)
    │   ├── CheckoutForm (Dumb)
    │   │   ├── FormField
    │   │   │   ├── Input
    │   │   │   └── ErrorMessage
    │   │   └── Button
    └── UserRegistrationContainer (Smart)
        └── UserRegistrationForm (Dumb)
```

## State Management Strategy

### Zustand + Custom Hooks Approach

```typescript
// formStore.ts - Clean and straightforward
interface FormState {
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

// apiStore.ts - Error handling + retry logic
interface ApiState {
  retryCount: number
  lastError: string | null
  isRetrying: boolean

  // Actions
  incrementRetry: () => void
  resetRetry: () => void
  setRetrying: (isRetrying: boolean) => void
}
```

### Custom Hooks Integration

```typescript
// useFormPersistence.ts - LocalStorage integration
export const useFormPersistence = () => {
  const formStore = useFormStore()

  useEffect(() => {
    // Load persisted data on mount
    formStore.loadPersistedForm()
  }, [])

  useEffect(() => {
    // Auto-save on form changes
    if (formStore.isDirty) {
      formStore.persistForm()
    }
  }, [formStore.formData])

  return {
    clearPersistedData: () => localStorage.removeItem('checkout-form'),
    hasPersistedData: () => localStorage.getItem('checkout-form') !== null,
  }
}

// useApiSimulation.ts - Multiple scenarios + retry logic
export const useApiSimulation = () => {
  const apiStore = useApiStore()

  const submitForm = async (data: CheckoutFormData) => {
    try {
      // Simulate API call with random scenarios
      const result = await simulateCheckoutAPI(data)
      return result
    } catch (error) {
      // Retry logic
      if (apiStore.retryCount < 3) {
        apiStore.incrementRetry()
        apiStore.setRetrying(true)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return submitForm(data)
      }
      throw error
    }
  }

  return { submitForm }
}
```

## Form Validation Strategy

### Formik + Built-in Validation

```typescript
// validation.ts - Clean validation schemas
import * as yup from 'yup'

export const checkoutSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),

  fullName: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .required('Full name is required'),

  cardNumber: yup
    .string()
    .matches(/^\d{16}$/, 'Card number must be 16 digits')
    .required('Card number is required'),

  expiryDate: yup
    .string()
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Invalid expiry date (MM/YY)')
    .test('future-date', 'Expiry date must be in future', (value) => {
      if (!value) return false
      const [month, year] = value.split('/')
      const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1)
      return expiry > new Date()
    })
    .required('Expiry date is required'),

  cvv: yup
    .string()
    .matches(/^\d{3,4}$/, 'CVV must be 3-4 digits')
    .required('CVV is required'),
})
```

## API Integration with Error Handling

### Enhanced API Simulation

```typescript
// apiSimulation.ts - Multiple scenarios
export const simulateCheckoutAPI = async (
  formData: CheckoutFormData
): Promise<ApiResponse> => {
  // Realistic network delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Weighted scenarios for better demo
  const scenarios = [
    { type: 'success', weight: 0.6 },
    { type: 'validation_error', weight: 0.2 },
    { type: 'network_error', weight: 0.1 },
    { type: 'server_error', weight: 0.1 },
  ]

  const random = Math.random()
  let cumulative = 0

  for (const scenario of scenarios) {
    cumulative += scenario.weight
    if (random <= cumulative) {
      return handleScenario(scenario.type, formData)
    }
  }
}

const handleScenario = (type: string, formData: CheckoutFormData) => {
  switch (type) {
    case 'success':
      return { success: true, data: { orderId: generateOrderId() } }
    case 'validation_error':
      return {
        success: false,
        error: 'Card validation failed',
        fieldErrors: { cardNumber: 'This card number is invalid' },
      }
    case 'network_error':
      throw new Error('Network connection failed')
    case 'server_error':
      throw new Error('Server temporarily unavailable')
    default:
      return { success: true, data: { orderId: generateOrderId() } }
  }
}
```

## Credit Card Formatting Implementation

### Real-time Formatting Hook

```typescript
// useCardFormatting.ts
export const useCardFormatting = () => {
  const formatCardNumber = (value: string): string => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '')

    // Add spaces every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ')

    // Limit to 16 digits
    return formatted.substring(0, 19) // 16 digits + 3 spaces
  }

  const formatExpiryDate = (value: string): string => {
    const cleaned = value.replace(/\D/g, '')

    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4)
    }

    return cleaned
  }

  const maskCvv = (value: string): string => {
    return value.replace(/\d/g, '•')
  }

  return {
    formatCardNumber,
    formatExpiryDate,
    maskCvv,
  }
}
```

## TypeScript Implementation (Clean & Straightforward)

### Simple, Clean Type Definitions

```typescript
// form.types.ts - No complex generics
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

// api.types.ts - Simple API types
export interface ApiResponse {
  success: boolean
  data?: {
    orderId: string
  }
  error?: string
  fieldErrors?: Partial<Record<keyof CheckoutFormData, string>>
}

export interface ApiState {
  isLoading: boolean
  error: string | null
  retryCount: number
  isRetrying: boolean
}
```

## Updated Implementation Timeline (35-40 minutes)

### Phase 1 (0-5 minutes) - Setup & Demo Introduction

- **Quick project overview** (pre-setup boilerplate)
- **Explain architecture decisions** (Zustand, Formik, TypeScript)
- **Show project structure** and component hierarchy

### Phase 2 (5-20 minutes) - Core Implementation

- **Implement Zustand stores** (form + API state)
- **Build form components** with Formik integration
- **Add real-time validation** and error handling
- **Implement credit card formatting** hooks

### Phase 3 (20-30 minutes) - Advanced Features

- **Add API simulation** with multiple scenarios
- **Implement retry logic** and error recovery
- **Add form persistence** with localStorage
- **Polish loading states** and UX details

### Phase 4 (30-35 minutes) - Demo & Testing

- **Demonstrate all features** working together
- **Show error scenarios** and recovery
- **Display form persistence** across page refreshes
- **Highlight key technical decisions**

### Phase 5 (35-40 minutes) - Q&A Buffer

- **Answer technical questions**
- **Discuss scaling considerations**
- **Explain alternative approaches**

## Key Demonstration Points

### Technical Excellence

1. **Clean TypeScript** - Straightforward, well-typed code
2. **Smart component architecture** - Reusable, focused components
3. **Zustand + custom hooks** - Modern state management pattern
4. **Real-time form validation** - Seamless user experience
5. **Comprehensive error handling** - Network failures, validation errors

### Development Process

1. **Incremental implementation** - Build features step by step
2. **Problem-solving approach** - Handle edge cases and errors
3. **User experience focus** - Loading states, error messages, persistence
4. **Performance considerations** - Efficient re-renders, debouncing
5. **Code organization** - Clean separation of concerns

## Fallback Strategy

### Progressive Feature Implementation

1. **Core MVP** (15 minutes) - Basic form with validation
2. **API Integration** (25 minutes) - Add submission and error handling
3. **Advanced Features** (35 minutes) - Persistence, retry logic, formatting
4. **Polish** (40 minutes) - UX improvements and edge cases

### Risk Mitigation

- **Pre-built boilerplate** - Reduces setup time
- **Practiced demo flow** - Smooth presentation
- **Fallback checkpoints** - Can stop at any working state
- **Error handling focus** - Show debugging skills if issues arise

## Success Metrics

### Must-Have Demonstrations

- **Working form** with real-time validation
- **API simulation** with error scenarios
- **State persistence** across page refreshes
- **Error handling** with retry logic
- **Credit card formatting** with live updates
- **Loading states** and smooth UX
- **Clean TypeScript** throughout
- **Zustand integration** with custom hooks

### Technical Skills Showcased

- **Form expertise** - Formik, validation, UX
- **State management** - Zustand patterns
- **TypeScript proficiency** - Clean, practical typing
- **React best practices** - Hooks, component design
- **Error handling** - Comprehensive approach
- **Performance awareness** - Efficient implementations
