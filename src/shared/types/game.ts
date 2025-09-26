export interface Game {
  id: string;
  name: string;
  genre: string;
  description: string;
  price: number;
  image: string;
  isNew: boolean;
}

export interface CartItem extends Game {
  quantity: number;
}

export interface GamesResponse {
  games: Game[];
  availableFilters: string[];
  totalPages: number;
  currentPage: number;
}

export interface CartSummary {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}
