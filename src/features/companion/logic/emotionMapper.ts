import type {
  EmotionMappingResult,
  EmotionTag,
  CompanionPersona,
  Mover,
  MoveClassification,
} from '../types';

/**
 * Disallowed emotions by persona.
 * E.g., 'parent' persona never expresses hostility/anger.
 */
const PERSONA_FORBIDDEN_EMOTIONS: Record<CompanionPersona, ReadonlySet<EmotionTag>> = {
  parent: new Set(['ANGRY']),
  teacher: new Set(['ANGRY', 'FACEPALM']),
  friend: new Set(['ANGRY']),
  rival: new Set(['ENCOURAGING']),
  coach: new Set([]),
};

/**
 * Maps a move classification, mover ('player' | 'opponent'), and companion persona
 * to a deterministic default emotion and a strictly allowed emotion subset.
 *
 * Non-negotiable Rule 4:
 * The LLM may only select an emotion from the returned allowed set.
 * A player blunder can never produce TRIUMPHANT.
 */
export function getEmotionMapping(
  classification: MoveClassification,
  mover: Mover,
  persona: CompanionPersona = 'coach',
): EmotionMappingResult {
  let baseDefault: EmotionTag;
  let baseAllowed: EmotionTag[];

  if (mover === 'player') {
    switch (classification) {
      case 'brilliant':
        baseDefault = 'TRIUMPHANT';
        baseAllowed = ['TRIUMPHANT', 'HAPPY', 'SHOCKED'];
        break;
      case 'great':
        baseDefault = 'HAPPY';
        baseAllowed = ['HAPPY', 'TRIUMPHANT', 'ENCOURAGING'];
        break;
      case 'best':
        baseDefault = 'HAPPY';
        baseAllowed = ['HAPPY', 'THINKING', 'ENCOURAGING'];
        break;
      case 'excellent':
        baseDefault = 'HAPPY';
        baseAllowed = ['HAPPY', 'THINKING'];
        break;
      case 'good':
        baseDefault = 'HAPPY';
        baseAllowed = ['HAPPY', 'IDLE', 'THINKING'];
        break;
      case 'book':
        baseDefault = 'THINKING';
        baseAllowed = ['THINKING', 'IDLE', 'HAPPY'];
        break;
      case 'inaccuracy':
        baseDefault = 'CONCERNED';
        baseAllowed = ['CONCERNED', 'THINKING', 'ENCOURAGING'];
        break;
      case 'mistake':
        baseDefault = 'CONCERNED';
        baseAllowed = ['CONCERNED', 'ENCOURAGING', 'FACEPALM'];
        break;
      case 'miss':
        baseDefault = 'CONCERNED';
        baseAllowed = ['CONCERNED', 'FACEPALM', 'ENCOURAGING'];
        break;
      case 'blunder':
        baseDefault = 'FACEPALM';
        baseAllowed = ['FACEPALM', 'CONCERNED', 'SHOCKED', 'ENCOURAGING', 'ANGRY'];
        break;
    }
  } else {
    // mover === 'opponent'
    switch (classification) {
      case 'brilliant':
        baseDefault = 'SHOCKED';
        baseAllowed = ['SHOCKED', 'CONCERNED', 'THINKING'];
        break;
      case 'great':
        baseDefault = 'CONCERNED';
        baseAllowed = ['CONCERNED', 'THINKING', 'SHOCKED'];
        break;
      case 'best':
        baseDefault = 'THINKING';
        baseAllowed = ['THINKING', 'IDLE', 'CONCERNED'];
        break;
      case 'excellent':
        baseDefault = 'THINKING';
        baseAllowed = ['THINKING', 'IDLE'];
        break;
      case 'good':
        baseDefault = 'IDLE';
        baseAllowed = ['IDLE', 'THINKING'];
        break;
      case 'book':
        baseDefault = 'THINKING';
        baseAllowed = ['THINKING', 'IDLE'];
        break;
      case 'inaccuracy':
        baseDefault = 'HAPPY';
        baseAllowed = ['HAPPY', 'THINKING'];
        break;
      case 'mistake':
        baseDefault = 'HAPPY';
        baseAllowed = ['HAPPY', 'TRIUMPHANT', 'THINKING'];
        break;
      case 'miss':
        baseDefault = 'HAPPY';
        baseAllowed = ['HAPPY', 'TRIUMPHANT', 'SHOCKED'];
        break;
      case 'blunder':
        baseDefault = 'TRIUMPHANT';
        baseAllowed = ['TRIUMPHANT', 'HAPPY', 'SHOCKED'];
        break;
    }
  }

  // Filter allowed emotions according to persona restrictions
  const forbidden = PERSONA_FORBIDDEN_EMOTIONS[persona] ?? new Set<EmotionTag>();
  const allowed = baseAllowed.filter((emotion) => !forbidden.has(emotion));

  // Determine final default: if original default was forbidden, use the first allowed tag
  let finalDefault: EmotionTag = baseDefault;
  if (forbidden.has(baseDefault)) {
    finalDefault = allowed[0] ?? (mover === 'player' ? 'ENCOURAGING' : 'HAPPY');
  }

  return {
    default: finalDefault,
    allowed: allowed.length > 0 ? allowed : [finalDefault],
  };
}
