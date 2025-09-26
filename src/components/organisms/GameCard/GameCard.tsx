import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button, Badge } from '@/components/atoms';
import { cn } from '@/shared/utils/cn';
import { Game } from '@/shared/types/game';

export interface GameCardProps {
  game: Game;
  isInCart?: boolean;
  onAddToCart?: (game: Game) => void;
  onRemoveFromCart?: (gameId: string) => void;
  className?: string;
  animated?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({
  game,
  isInCart = false,
  onAddToCart,
  onRemoveFromCart,
  className,
  animated = true,
}) => {
  const handleCartAction = () => {
    if (isInCart) {
      onRemoveFromCart?.(game.id);
    } else {
      onAddToCart?.(game);
    }
  };

  if (animated) {
    return (
      <motion.div
        className={cn(
          'bg-surface-primary rounded-lg shadow-sm overflow-hidden',
          'hover:shadow-xl transition-shadow duration-300',
          'border border-border-primary group',
          className
        )}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{
          y: -8,
          scale: 1.02,
          transition: { type: "spring" as const, stiffness: 400, damping: 25 }
        }}
        transition={{
          type: "spring" as const,
          stiffness: 300,
          damping: 30,
        }}
      >
      <div className="relative p-3">
        <Image
          src={game.image}
          alt={game.name}
          width={400}
          height={240}
          className="w-full h-60 object-cover rounded-t"
          priority={false}
        />
        
        {game.isNew && (
          <Badge
            variant="info"
            size="sm"
            className="absolute top-0 left-0 m-3"
          >
            New
          </Badge>
        )}
        
        {/* Description overlay - only visible on desktop hover */}
        <div className="absolute inset-0 bg-brand-secondary bg-opacity-90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center p-4">
          <p className="text-white text-base text-center leading-relaxed">
            {game.description}
          </p>
        </div>
      </div>
      
      <div className="p-3 space-y-3">
        <div>
          <p className="text-xs text-text-secondary uppercase font-semibold mb-1">
            Genre: {game.genre}
          </p>
          
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-text-primary truncate pr-2">
              {game.name}
            </h3>
            <span className="text-xl font-bold text-text-primary flex-shrink-0">
              ${game.price.toFixed(2)}
            </span>
          </div>
        </div>
        
        <Button
          variant={isInCart ? 'danger' : 'outline'}
          size="lg"
          fullWidth
          onClick={handleCartAction}
          className="uppercase font-semibold"
        >
          {isInCart ? 'Remove' : 'Add to Cart'}
        </Button>
      </div>
    </motion.div>
    );
  }

  return (
    <div
      className={cn(
        'bg-surface-primary rounded-lg shadow-sm overflow-hidden',
        'hover:shadow-xl transition-shadow duration-300',
        'border border-border-primary group',
        className
      )}
    >
      <div className="relative p-3">
        <Image
          src={game.image}
          alt={game.name}
          width={400}
          height={240}
          className="w-full h-60 object-cover rounded-t"
          priority={false}
        />
        
        {game.isNew && (
          <Badge
            variant="info"
            size="sm"
            className="absolute top-0 left-0 m-3"
          >
            New
          </Badge>
        )}
        
        {/* Description overlay - only visible on desktop hover */}
        <div className="absolute inset-0 bg-brand-secondary bg-opacity-90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center p-4">
          <p className="text-white text-base text-center leading-relaxed">
            {game.description}
          </p>
        </div>
      </div>
      
      <div className="p-3 space-y-3">
        <div>
          <p className="text-xs text-text-secondary uppercase font-semibold mb-1">
            Genre: {game.genre}
          </p>
          
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-text-primary truncate pr-2">
              {game.name}
            </h3>
            <span className="text-xl font-bold text-text-primary flex-shrink-0">
              ${game.price.toFixed(2)}
            </span>
          </div>
        </div>
        
        <Button
          variant={isInCart ? 'danger' : 'outline'}
          size="lg"
          fullWidth
          onClick={handleCartAction}
          className="uppercase font-semibold"
        >
          {isInCart ? 'Remove' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
};

export { GameCard };
