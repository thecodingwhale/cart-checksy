// Enhanced ErrorMessage and SuccessMessage components with better styling
import React from 'react'

interface ErrorMessageProps {
  message: string
  className?: string
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  className = '',
}) => {
  if (!message) return null

  return (
    <div className={`error-message ${className}`}>
      <svg
        className="w-4 h-4 mr-2 flex-shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      <span className="flex-1">{message}</span>
    </div>
  )
}

interface SuccessMessageProps {
  message: string
  className?: string
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  className = '',
}) => {
  if (!message) return null

  return (
    <div className={`success-message ${className}`}>
      <svg
        className="w-4 h-4 mr-2 flex-shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
      <span className="flex-1">{message}</span>
    </div>
  )
}
