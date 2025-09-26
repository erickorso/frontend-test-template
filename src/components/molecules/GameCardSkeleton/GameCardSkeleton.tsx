import React from 'react';
import { cn } from '@/shared/utils/cn';

export interface GameCardSkeletonProps {
  className?: string;
}

const GameCardSkeleton: React.FC<GameCardSkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'bg-surface-primary rounded-lg shadow-sm overflow-hidden',
        'border border-border-primary animate-pulse',
        className
      )}
    >
      <div className="p-3">
        <div className="w-full h-60 bg-surface-secondary rounded-t mb-3" />
      </div>
      
      <div className="p-3 space-y-3">
        <div className="space-y-2">
          <div className="h-3 w-16 bg-surface-secondary rounded" />
          <div className="flex justify-between items-center">
            <div className="h-5 w-32 bg-surface-secondary rounded" />
            <div className="h-6 w-16 bg-surface-secondary rounded" />
          </div>
        </div>
        
        <div className="h-12 w-full bg-surface-secondary rounded-lg" />
      </div>
    </div>
  );
};

export { GameCardSkeleton };
