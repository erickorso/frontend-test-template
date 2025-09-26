import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/shared/utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  animated?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      animated = true,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = cn(
      // Base styles
      'inline-flex items-center justify-center font-semibold rounded-lg',
      'transition-all duration-200 ease-in-out',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'relative overflow-hidden',
      
      // Size variants
      {
        'px-3 py-1.5 text-sm': size === 'sm',
        'px-4 py-2 text-base': size === 'md',
        'px-6 py-3 text-lg': size === 'lg',
        'px-8 py-4 text-xl': size === 'xl',
      },
      
      // Width
      {
        'w-full': fullWidth,
      },
      
      // Variant styles
      {
        // Primary
        'bg-brand-primary text-white hover:bg-brand-secondary focus:ring-brand-primary': 
          variant === 'primary',
        
        // Secondary
        'bg-surface-secondary text-text-primary hover:bg-surface-tertiary focus:ring-brand-primary': 
          variant === 'secondary',
        
        // Outline
        'border border-border-primary text-text-primary hover:bg-surface-secondary focus:ring-brand-primary': 
          variant === 'outline',
        
        // Ghost
        'text-text-primary hover:bg-surface-secondary focus:ring-brand-primary': 
          variant === 'ghost',
        
        // Danger
        'bg-brand-error text-white hover:bg-red-600 focus:ring-brand-error': 
          variant === 'danger',
      },
      
      className
    );

    const buttonContent = (
      <>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        <div className={cn('flex items-center gap-2', { 'opacity-0': isLoading })}>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </div>
      </>
    );

    if (animated) {
      return (
        <motion.button
          ref={ref}
          className={baseClasses}
          disabled={disabled || isLoading}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          {buttonContent}
        </motion.button>
      );
    }

    return (
      <button
        ref={ref}
        className={baseClasses}
        disabled={disabled || isLoading}
        {...props}
      >
        {buttonContent}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };