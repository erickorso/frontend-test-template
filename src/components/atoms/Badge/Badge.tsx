import React from 'react';
import { cn } from '@/shared/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  const baseClasses = cn(
    // Base styles
    'inline-flex items-center font-medium rounded-full',
    'transition-colors duration-200',
    
    // Size variants
    {
      'px-2 py-0.5 text-xs': size === 'sm',
      'px-2.5 py-1 text-sm': size === 'md',
      'px-3 py-1.5 text-base': size === 'lg',
    },
    
    // Variant styles
    {
      // Default
      'bg-surface-secondary text-text-primary border border-border-primary': 
        variant === 'default',
      
      // Success
      'bg-green-100 text-green-800 border border-green-200': 
        variant === 'success',
      
      // Warning
      'bg-yellow-100 text-yellow-800 border border-yellow-200': 
        variant === 'warning',
      
      // Error
      'bg-red-100 text-red-800 border border-red-200': 
        variant === 'error',
      
      // Info
      'bg-blue-100 text-blue-800 border border-blue-200': 
        variant === 'info',
    },
    
    className
  );

  return (
    <span className={baseClasses} {...props}>
      {children}
    </span>
  );
};

export { Badge };
