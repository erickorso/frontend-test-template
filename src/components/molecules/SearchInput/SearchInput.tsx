import React from 'react';
import { Input } from '@/components/atoms';
import { cn } from '@/shared/utils/cn';

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onSearch?: (value: string) => void;
  onClear?: () => void;
  showClearButton?: boolean;
  loading?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  className,
  onSearch,
  onClear,
  showClearButton = true,
  loading = false,
  value,
  onChange,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    onSearch?.(e.target.value);
  };

  const handleClear = () => {
    onClear?.();
  };

  const searchIcon = (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );

  const clearIcon = (
    <button
      type="button"
      onClick={handleClear}
      className="p-1 hover:bg-surface-secondary rounded-full transition-colors duration-200"
      aria-label="Clear search"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );

  const loadingIcon = (
    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
  );

  return (
    <div className={cn('relative', className)}>
      <Input
        type="search"
        placeholder="Search games..."
        value={value}
        onChange={handleChange}
        leftIcon={loading ? loadingIcon : searchIcon}
        rightIcon={showClearButton && value && !loading ? clearIcon : undefined}
        className="pr-10"
        {...props}
      />
    </div>
  );
};

export { SearchInput };
