export interface EngineEvaluation {
  score: number; // centipawns (from White perspective)
  mate?: number | null; // moves to mate if detected
  depth: number;
  bestMove: string;
  ponder?: string;
  pv?: string[];
}

export type EngineStatus = 'idle' | 'loading' | 'analyzing' | 'ready' | 'error';
