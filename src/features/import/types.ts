export interface ImportedGame {
  id: string;
  source: 'pgn' | 'chess.com' | 'lichess';
  pgn: string;
  white: string;
  black: string;
  date?: string;
  result?: string;
}
