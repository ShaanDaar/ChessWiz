import { describe, it, expect } from 'vitest';
import { getEmotionMapping } from '../emotionMapper';
import type { MoveClassification } from '../../types';

describe('getEmotionMapping', () => {
  const allClassifications: MoveClassification[] = [
    'brilliant',
    'great',
    'best',
    'excellent',
    'good',
    'book',
    'inaccuracy',
    'mistake',
    'miss',
    'blunder',
  ];

  describe('Player moves across all 10 classifications', () => {
    it.each(allClassifications)(
      'returns valid mapping for classification: %s (mover: player)',
      (classification) => {
        const result = getEmotionMapping(classification, 'player', 'coach');

        expect(result.default).toBeDefined();
        expect(Array.isArray(result.allowed)).toBe(true);
        expect(result.allowed.length).toBeGreaterThan(0);
        // Default must always belong to allowed set
        expect(result.allowed).toContain(result.default);

        // Core Rule 4: A player blunder/mistake/miss must NEVER allow TRIUMPHANT
        if (['blunder', 'mistake', 'miss', 'inaccuracy'].includes(classification)) {
          expect(result.allowed).not.toContain('TRIUMPHANT');
          // Must lean towards CONCERNED, ENCOURAGING, or FACEPALM
          const hasNegativeReaction = result.allowed.some((emotion) =>
            ['CONCERNED', 'ENCOURAGING', 'FACEPALM'].includes(emotion),
          );
          expect(hasNegativeReaction).toBe(true);
        }
      },
    );
  });

  describe('Opponent moves across all 10 classifications', () => {
    it.each(allClassifications)(
      'returns valid mapping for classification: %s (mover: opponent)',
      (classification) => {
        const result = getEmotionMapping(classification, 'opponent', 'coach');

        expect(result.default).toBeDefined();
        expect(Array.isArray(result.allowed)).toBe(true);
        expect(result.allowed.length).toBeGreaterThan(0);
        expect(result.allowed).toContain(result.default);

        // Opponent blunders and mistakes should lean HAPPY / TRIUMPHANT
        if (['blunder', 'mistake', 'miss'].includes(classification)) {
          const hasPositiveReaction = result.allowed.some((emotion) =>
            ['HAPPY', 'TRIUMPHANT'].includes(emotion),
          );
          expect(hasPositiveReaction).toBe(true);
        }
      },
    );
  });

  describe('Persona-based emotion filtering', () => {
    it('parent persona never allows ANGRY even on a player blunder', () => {
      const result = getEmotionMapping('blunder', 'player', 'parent');
      expect(result.allowed).not.toContain('ANGRY');
      expect(result.default).not.toBe('ANGRY');
    });

    it('teacher persona never allows ANGRY or FACEPALM', () => {
      const result = getEmotionMapping('blunder', 'player', 'teacher');
      expect(result.allowed).not.toContain('ANGRY');
      expect(result.allowed).not.toContain('FACEPALM');
      expect(result.default).not.toBe('ANGRY');
      expect(result.default).not.toBe('FACEPALM');
    });

    it('rival persona never allows ENCOURAGING', () => {
      const result = getEmotionMapping('great', 'player', 'rival');
      expect(result.allowed).not.toContain('ENCOURAGING');
    });

    it('friend persona never allows ANGRY', () => {
      const result = getEmotionMapping('blunder', 'player', 'friend');
      expect(result.allowed).not.toContain('ANGRY');
    });
  });
});
