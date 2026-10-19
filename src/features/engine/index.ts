/**
 * Engine feature public exports.
 *
 * NOTE (Rule 2 & User Constraint):
 * Keep the Stockfish Web Worker file out of barrel exports!
 * Direct imports of the worker script (e.g. `stockfish.worker.ts`) must only occur
 * inside client-only hooks/services (`'use client'`) to prevent server bundles
 * from ever attempting to bundle or execute browser Web Workers or WASM.
 */

export * from './types';
