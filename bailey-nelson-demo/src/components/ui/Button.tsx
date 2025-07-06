// Enhanced Button component with better styling
import React from 'react'

interface ButtonProps {
  type: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'danger'
  onClick?: () => void
  loading?: boolean
  disabled?: boolean
  children: React.ReactNode
  className?: string
}

export const Button: React.FC<ButtonProps> = ({
  type,
  variant = 'primary',
  onClick,
  loading = false,
  disabled = false,
  children,
  className = '',
}) => {
  const baseClasses = 'form-button'
  const variantClasses = {
    primary: '',
    secondary: 'secondary',
    danger: 'danger',
  }

  const variantClass = variantClasses[variant]
  const buttonClasses = `${baseClasses} ${variantClass} ${className}`.trim()

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="loading-spinner mr-2"></div>
          Processing...
        </div>
      ) : (
        children
      )}
    </button>
  )
}
