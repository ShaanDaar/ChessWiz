export type ChessPieceColor = 'w' | 'b';

export interface GameMove {
  from: string;
  to: string;
  promotion?: string;
  san: string;
  fen: string;
}

export interface GameState {
  fen: string;
  isGameOver: boolean;
  turn: ChessPieceColor;
  moves: GameMove[];
}
