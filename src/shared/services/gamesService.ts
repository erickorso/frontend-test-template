import { Game, GamesResponse } from '@/shared/types/game';

export interface SearchOptions {
  page: number;
  genre: string;
}

class GamesService {
  private readonly API_BASE = '/api/games';

  async getGames(page: number = 1, genre: string = ''): Promise<GamesResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      ...(genre && { genre }),
    });

    const response = await fetch(`${this.API_BASE}?${params}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch games: ${response.statusText}`);
    }

    return response.json();
  }

  async searchGames(query: string, options: SearchOptions): Promise<GamesResponse> {
    const params = new URLSearchParams({
      search: query,
      page: options.page.toString(),
      ...(options.genre && { genre: options.genre }),
    });

    const response = await fetch(`${this.API_BASE}?${params}`);
    
    if (!response.ok) {
      throw new Error(`Failed to search games: ${response.statusText}`);
    }

    return response.json();
  }
}

export const gamesService = new GamesService();
