export type MoveClassification =
  | 'brilliant'
  | 'great'
  | 'best'
  | 'excellent'
  | 'good'
  | 'book'
  | 'inaccuracy'
  | 'mistake'
  | 'miss'
  | 'blunder';

export interface ReviewedMove {
  moveNumber: number;
  san: string;
  fenBefore: string;
  fenAfter: string;
  mover: 'player' | 'opponent';
  playedMove: string;
  bestMove: string;
  classification: MoveClassification;
  evalBefore: number;
  evalAfter: number;
  evalDelta: number;
}

export interface GameReviewReport {
  moves: ReviewedMove[];
  accuracyScore: {
    player: number;
    opponent: number;
  };
}
