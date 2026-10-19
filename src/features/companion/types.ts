import type { MoveClassification } from '../review/types';

export type EmotionTag =
  | 'IDLE'
  | 'THINKING'
  | 'HAPPY'
  | 'TRIUMPHANT'
  | 'CONCERNED'
  | 'SHOCKED'
  | 'FACEPALM'
  | 'ANGRY'
  | 'ENCOURAGING';

export type CompanionPersona = 'friend' | 'coach' | 'teacher' | 'parent' | 'rival';

export type Mover = 'player' | 'opponent';

export interface EmotionMappingResult {
  default: EmotionTag;
  allowed: EmotionTag[];
}

export type { MoveClassification };
