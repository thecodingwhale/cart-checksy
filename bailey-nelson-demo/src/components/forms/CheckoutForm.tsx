// Main CheckoutForm component with enhanced styling
import type { FormikHelpers } from 'formik'
import { Form, Formik } from 'formik'
import React from 'react'
import { useApiSimulation } from '../../hooks/useApiSimulation'
import { useFormPersistence } from '../../hooks/useFormPersistence'
import {
  useFormActions,
  useFormData,
  useFormStatus,
} from '../../store/formStore'
import type { CheckoutFormData } from '../../types/form.types'
import { checkoutSchema, fieldConfigs } from '../../utils/validation'
import { Button } from '../ui/Button'
import { ErrorMessage, SuccessMessage } from '../ui/ErrorMessage'
import { Input } from '../ui/Input'

export const CheckoutForm: React.FC = () => {
  const formData = useFormData()
  const formActions = useFormActions()
  const formStatus = useFormStatus()
  const apiSimulation = useApiSimulation()
  const formPersistence = useFormPersistence()

  const handleSubmit = async (
    values: CheckoutFormData,
    { setSubmitting, setFieldError }: FormikHelpers<CheckoutFormData>
  ) => {
    try {
      setSubmitting(true)

      // Submit form using TanStack Query mutation
      const result = await apiSimulation.submitForm(values)

      if (result.success) {
        // Success - show success message
        console.log('Order submitted successfully:', result.data?.orderId)

        // Optionally clear form after successful submission
        // formActions.resetForm()
        // formPersistence.clearPersistedData()
      } else {
        // Handle validation errors from the API response
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, error]) => {
            setFieldError(field, error)
          })
        }
      }
    } catch (error) {
      console.error('Submission error:', error)
      // TanStack Query handles error state automatically
    } finally {
      setSubmitting(false)
    }
  }

  const handleFieldChange = (field: string, value: string) => {
    formActions.updateFormData({ [field]: value } as Partial<CheckoutFormData>)
  }

  return (
    <div className="space-y-8">
      {/* Form persistence status */}
      {formPersistence.isDirty && (
        <div className="persistence-indicator">
          <p className="persistence-text">
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Form data is being saved automatically
          </p>
        </div>
      )}

      <Formik
        initialValues={formData}
        validationSchema={checkoutSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ isSubmitting, errors, touched, values, handleBlur }) => (
          <Form className="space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Personal Information
                </h3>
              </div>

              {/* Email Field */}
              <Input
                name="email"
                label={fieldConfigs.email.label}
                type={fieldConfigs.email.type}
                value={values.email}
                onChange={handleFieldChange}
                onBlur={() => handleBlur('email')}
                error={touched.email && errors.email ? errors.email : undefined}
                placeholder={fieldConfigs.email.placeholder}
                autoComplete={fieldConfigs.email.autoComplete}
                required={true}
              />

              {/* Full Name Field */}
              <Input
                name="fullName"
                label={fieldConfigs.fullName.label}
                type={fieldConfigs.fullName.type}
                value={values.fullName}
                onChange={handleFieldChange}
                onBlur={() => handleBlur('fullName')}
                error={
                  touched.fullName && errors.fullName
                    ? errors.fullName
                    : undefined
                }
                placeholder={fieldConfigs.fullName.placeholder}
                autoComplete={fieldConfigs.fullName.autoComplete}
                required={true}
              />
            </div>

            {/* Payment Information Section */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path
                      fillRule="evenodd"
                      d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Payment Information
                </h3>
              </div>

              {/* Card Number Field */}
              <Input
                name="cardNumber"
                label={fieldConfigs.cardNumber.label}
                type={fieldConfigs.cardNumber.type}
                value={values.cardNumber}
                onChange={handleFieldChange}
                onBlur={() => handleBlur('cardNumber')}
                error={
                  touched.cardNumber && errors.cardNumber
                    ? errors.cardNumber
                    : undefined
                }
                placeholder={fieldConfigs.cardNumber.placeholder}
                maxLength={fieldConfigs.cardNumber.maxLength}
                autoComplete={fieldConfigs.cardNumber.autoComplete}
                required={true}
              />

              {/* Expiry Date and CVV Row */}
              <div className="card-row">
                <Input
                  name="expiryDate"
                  label={fieldConfigs.expiryDate.label}
                  type={fieldConfigs.expiryDate.type}
                  value={values.expiryDate}
                  onChange={handleFieldChange}
                  onBlur={() => handleBlur('expiryDate')}
                  error={
                    touched.expiryDate && errors.expiryDate
                      ? errors.expiryDate
                      : undefined
                  }
                  placeholder={fieldConfigs.expiryDate.placeholder}
                  maxLength={fieldConfigs.expiryDate.maxLength}
                  autoComplete={fieldConfigs.expiryDate.autoComplete}
                  required={true}
                />

                <Input
                  name="cvv"
                  label={fieldConfigs.cvv.label}
                  type={fieldConfigs.cvv.type}
                  value={values.cvv}
                  onChange={handleFieldChange}
                  onBlur={() => handleBlur('cvv')}
                  error={touched.cvv && errors.cvv ? errors.cvv : undefined}
                  placeholder={fieldConfigs.cvv.placeholder}
                  maxLength={fieldConfigs.cvv.maxLength}
                  autoComplete={fieldConfigs.cvv.autoComplete}
                  required={true}
                />
              </div>
            </div>

            {/* Error Messages - Show TanStack Query errors or form errors */}
            {(apiSimulation.error || formStatus.submitError) && (
              <div className="error-container">
                <ErrorMessage
                  message={apiSimulation.error || formStatus.submitError || ''}
                />
              </div>
            )}

            {/* Success Messages - Show TanStack Query success or form success */}
            {(apiSimulation.isSuccess || formStatus.submitSuccess) && (
              <div className="success-container">
                <SuccessMessage message="Payment processed successfully! 🎉" />
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              loading={isSubmitting || apiSimulation.isLoading}
              disabled={isSubmitting || apiSimulation.isLoading}
              className="w-full text-lg py-4"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              Complete Payment
            </Button>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="button"
                onClick={() => {
                  formActions.resetForm()
                  apiSimulation.resetApiState()
                }}
                className="form-action-link flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M10 15a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm0 2h8v12H6V4z"
                    clipRule="evenodd"
                  />
                </svg>
                Clear Form
              </button>

              {formPersistence.hasPersistedData() && (
                <button
                  type="button"
                  onClick={() => formPersistence.confirmClearData()}
                  className="form-action-link flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M10 15a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm0 2h8v12H6V4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Clear Saved Data
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
