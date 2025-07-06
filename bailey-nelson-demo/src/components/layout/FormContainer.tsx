// FormContainer layout component with enhanced styling
import React from 'react'

interface FormContainerProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  className?: string
}

export const FormContainer: React.FC<FormContainerProps> = ({
  children,
  title,
  subtitle,
  className = '',
}) => {
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 ${className}`}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        {title && (
          <div className="form-header">
            <h2 className="form-title">{title}</h2>
            {subtitle && <p className="form-subtitle">{subtitle}</p>}
          </div>
        )}
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="form-container py-10 px-8 sm:px-12">{children}</div>
      </div>
    </div>
  )
}
