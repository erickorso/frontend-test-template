import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/shared/utils/cn';

export interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
  title?: string;
  description?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  className,
  animated = true,
  title,
  description,
}) => {
  if (animated) {
    return (
      <motion.main
        className={cn(
          'min-h-screen bg-surface-secondary',
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeOut" as const }}
      >
      <div className="container-padding section-padding">
        {(title || description) && (
          <div className="mb-8 text-center">
            {title && (
              <h1 className="heading-primary mb-4">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-body max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </motion.main>
    );
  }

  return (
    <main
      className={cn(
        'min-h-screen bg-surface-secondary',
        className
      )}
    >
      <div className="container-padding section-padding">
        {(title || description) && (
          <div className="mb-8 text-center">
            {title && (
              <h1 className="heading-primary mb-4">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-body max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </main>
  );
};

export { PageLayout };
