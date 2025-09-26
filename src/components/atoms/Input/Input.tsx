import React, { forwardRef } from 'react';
import { cn } from '@/shared/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const baseClasses = cn(
      // Base styles
      'block w-full px-3 py-2 text-base',
      'bg-surface-primary border border-border-primary rounded-lg',
      'placeholder:text-text-tertiary',
      'focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-secondary',
      'transition-colors duration-200',
      
      // Error state
      {
        'border-brand-error focus:ring-brand-error focus:border-brand-error': error,
      },
      
      // Icons padding
      {
        'pl-10': leftIcon,
        'pr-10': rightIcon,
      },
      
      // Width
      {
        'w-full': fullWidth,
      },
      
      className
    );

    return (
      <div className={cn('space-y-1', { 'w-full': fullWidth })}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-primary"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-text-tertiary">{leftIcon}</span>
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={baseClasses}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-text-tertiary">{rightIcon}</span>
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-brand-error" role="alert">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-text-secondary">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
