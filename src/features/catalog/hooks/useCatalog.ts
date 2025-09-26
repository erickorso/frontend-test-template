import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { gamesService } from '@/shared/services/gamesService';
import { Game, GamesResponse } from '@/shared/types/game';

interface UseCatalogProps {
  initialGenre?: string;
  initialSearch?: string;
}

interface UseCatalogResult {
  games: Game[];
  isLoading: boolean;
  isFilterLoading: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
  genre: string;
  search: string;
  availableGenres: string[];
  loadMoreGames: () => void;
  setGenre: (genre: string) => void;
  setSearch: (search: string) => void;
  clearFilters: () => void;
}

export const useCatalog = ({ 
  initialGenre = '', 
  initialSearch = '' 
}: UseCatalogProps = {}): UseCatalogResult => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);

  const genre = searchParams.get('genre') || initialGenre;
  const search = searchParams.get('search') || initialSearch;

  const loadGames = useCallback(async (pageNumber: number, isLoadMore: boolean = false) => {
    try {
      setError(null);
      if (!isLoadMore) {
        setIsLoading(true);
        setIsFilterLoading(true);
      }

      const fetchOperation = search && search.trim()
        ? gamesService.searchGames(search, { page: pageNumber, genre })
        : gamesService.getGames(pageNumber, genre);

      const [data] = await Promise.all([
        fetchOperation,
        process.env.NODE_ENV === 'test'
          ? Promise.resolve()
          : new Promise(resolve => setTimeout(resolve, 1000)) // Skeleton loading delay
      ]);

      if (isLoadMore) {
        setGames((prevGames) => [...prevGames, ...data.games]);
      } else {
        setGames(data.games);
        setAvailableGenres(data.availableFilters);
      }
      
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setHasMore(data.currentPage < data.totalPages);
    } catch (err) {
      setError('Failed to load games. Please try again.');
      console.error('Error loading games:', err);
    } finally {
      setIsLoading(false);
      setIsFilterLoading(false);
    }
  }, [genre, search]);

  useEffect(() => {
    setGames([]); // Clear games when filters change
    setCurrentPage(1);
    loadGames(1);
  }, [genre, search, loadGames]);

  const loadMoreGames = useCallback(() => {
    if (!isLoading && hasMore) {
      loadGames(currentPage + 1, true);
    }
  }, [isLoading, hasMore, currentPage, loadGames]);

  const setGenre = useCallback((newGenre: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newGenre) {
      params.set('genre', newGenre);
    } else {
      params.delete('genre');
    }
    router.push(`/catalog?${params.toString()}`);
  }, [searchParams, router]);

  const setSearch = useCallback((newSearch: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newSearch.trim()) {
      params.set('search', newSearch);
    } else {
      params.delete('search');
    }
    router.push(`/catalog?${params.toString()}`);
  }, [searchParams, router]);

  const clearFilters = useCallback(() => {
    router.push('/catalog');
  }, [router]);

  return {
    games,
    isLoading,
    isFilterLoading,
    error,
    currentPage,
    hasMore,
    genre,
    search,
    availableGenres,
    loadMoreGames,
    setGenre,
    setSearch,
    clearFilters,
  };
};
