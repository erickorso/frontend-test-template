import React from 'react';
import { motion } from 'framer-motion';
import { GameCard } from '@/components/organisms/GameCard';
import { GameCardSkeleton } from '@/components/molecules/GameCardSkeleton';
import { cn } from '@/shared/utils/cn';
import { Game } from '@/shared/types/game';

export interface GameGridProps {
  games: Game[];
  isLoading?: boolean;
  isInCart?: (gameId: string) => boolean;
  onAddToCart?: (game: Game) => void;
  onRemoveFromCart?: (gameId: string) => void;
  className?: string;
  animated?: boolean;
  skeletonCount?: number;
}

const GameGrid: React.FC<GameGridProps> = ({
  games,
  isLoading = false,
  isInCart,
  onAddToCart,
  onRemoveFromCart,
  className,
  animated = true,
  skeletonCount = 8,
}) => {
  if (isLoading) {
    return (
      <div className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
        'animate-fade-in',
        className
      )}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <GameCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className={cn(
        'text-center py-12',
        className
      )}>
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 bg-surface-secondary rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-text-tertiary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            No games found
          </h3>
          <p className="text-text-secondary">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      </div>
    );
  }

  const GridComponent = animated ? motion.div : 'div';
  const motionProps = animated ? {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 }
  } : {};

  return (
    <GridComponent
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
        className
      )}
      {...motionProps}
    >
      {games.map((game, index) => (
        <GameCard
          key={game.id}
          game={game}
          isInCart={isInCart?.(game.id)}
          onAddToCart={onAddToCart}
          onRemoveFromCart={onRemoveFromCart}
          animated={animated}
        />
      ))}
    </GridComponent>
  );
};

export { GameGrid };
