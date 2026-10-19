# Chessie Architecture & System Design

This document establishes the foundational architectural contracts and **non-negotiable rules** for the **Chessie** application. Every future feature, pull request, and automated task MUST strictly adhere to these rules without exception.

---

## The 5 Non-Negotiable Rules

### 1. Stockfish as the Sole Source of Truth

- **Rule**: Stockfish is the **only source of truth** for position evaluation, best move calculations, and move classifications.
- **LLM Boundary**: The LLM **never** analyzes positions, evaluates lines, or calculates moves independently. The LLM only narrates structured, deterministic data it is provided.
- **Move Classifications**: Every reviewed move is classified into one of exactly 10 canonical categories:
  ```ts
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
  ```
- **Payload Flow**:
  1. Client / Engine computes FEN evaluation delta ($\Delta \text{eval}$ in centipawns / mate) and best move.
  2. Move is deterministically classified using engine thresholds.
  3. Structured JSON payload (including classification, eval before/after, best move, and emotion constraints) is sent to the narration endpoint.
  4. LLM receives structured data and generates persona-aligned commentary.

---

### 2. Stockfish Web Worker in Browser (WASM Lite)

- **Rule**: Stockfish runs locally in the browser inside a dedicated Web Worker using a single-threaded WebAssembly (WASM) lite build.
- **Worker Isolation & Bundling Guard**:
  - **Keep the Stockfish worker file out of barrel exports** (`src/features/engine/index.ts`).
  - Server-side code must NEVER bundle or reference the worker file.
  - Worker instantiation is encapsulated strictly within client-only modules (`'use client'`).
- **Performance**: Running the engine off the main thread ensures the UI maintains smooth 60+ FPS animations during deep calculations without blocking user input.

---

### 3. Server Routes for LLM Calls (Zero Client Leakage)

- **Rule**: All LLM calls (e.g. Google Gemini API) must execute inside Next.js App Router server routes (`/src/app/api/...`).
- **Security**:
  - API keys (`GEMINI_API_KEY`, etc.) reside strictly in server environment variables and **never** reach client bundles.
  - No LLM client SDK is ever imported in client components.
- **Contract**:
  - Client sends structured chess data and current companion state.
  - Server validates payloads with schemas, builds prompt templates, queries the LLM, validates output constraints, and streams/returns the response.

---

### 4. Companion Video Driven by Emotion Tags & Constrained Logic

- **Rule**: Companion video playback is driven by a typed `EmotionTag` enum, never by free text or unstructured LLM output.
- **Emotion Tag Set (9 clips per persona)**:
  ```ts
  export type EmotionTag =
    | 'IDLE'
    | 'THINKING'
    | 'HAPPY'
    | 'TRIUMPHANT'
    | 'CONCERNED'
    | 'SHOCKED'
    | 'FACEPALM'
    | 'ANGRY' // Calibrated as "mildly annoyed" to avoid hostility
    | 'ENCOURAGING'; // Gentle reaction for teacher/parent personas after mistakes
  ```
- **Emotion-Mapping Pure Function**:
  - Located at: `src/features/companion/logic/emotionMapper.ts`.
  - Function signature:
    ```ts
    function getEmotionMapping(
      classification: MoveClassification,
      mover: 'player' | 'opponent',
      persona: CompanionPersona,
    ): { default: EmotionTag; allowed: EmotionTag[] };
    ```
  - **Behavioral Constraints**:
    - **Player mistakes** (`inaccuracy`, `mistake`, `miss`, `blunder`) lean towards `CONCERNED`, `ENCOURAGING`, or `FACEPALM`. A player blunder can **never** permit `TRIUMPHANT`.
    - **Opponent mistakes** lean towards `HAPPY` or `TRIUMPHANT`.
    - **Persona filtering**: Personas strip inappropriate emotions from the allowed set (e.g. `parent` and `teacher` never express `ANGRY`).
    - **LLM Constraint**: The LLM's response schema strictly restricts its emotion tag selection to the returned `allowed` list.

---

### 5. Unit Tests for Pure Logic

- **Rule**: Every feature ships with unit tests covering its pure business logic.
- **Separation of Concerns**:
  - Game calculations, evaluation deltas, PGN parsers, and emotion mapping must be isolated into pure functions in `logic/` folders.
  - Pure logic has no React component or DOM dependencies.
- **Test Standards**:
  - Unit tests run via **Vitest**.
  - The emotion-mapping function is verified with 100% matrix coverage across both `player` and `opponent` movers for all 10 move classifications.

---

## Folder Layout & System Architecture

```text
ChessWiz/
├── docs/
│   └── ARCHITECTURE.md           # This document
├── e2e/
│   └── smoke.spec.ts             # Playwright E2E smoke tests
├── public/
│   ├── companion/                # Static video assets (9 clips per persona)
│   └── ...
├── src/
│   ├── app/                      # Next.js App Router (pages, layouts, API routes)
│   │   ├── api/                  # Server route handlers (LLM narration, auth endpoints)
│   │   ├── globals.css           # Tailwind v4 @theme CSS tokens
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── features/                 # Modular feature architecture
│   │   ├── auth/                 # User session, profile, and Supabase integration
│   │   ├── game/                 # Board interaction, move legalities, clock, game state
│   │   ├── engine/               # Stockfish WASM Web Worker orchestration & UCI parsing
│   │   │   ├── logic/
│   │   │   ├── hooks/
│   │   │   ├── types.ts
│   │   │   └── index.ts          # Barrel export (Worker file EXCLUDED)
│   │   ├── review/               # Move classification (10 classes), accuracy scoring, report
│   │   ├── companion/            # Emotion tags (9), persona logic, video clip selector
│   │   │   ├── logic/
│   │   │   │   ├── emotionMapper.ts
│   │   │   │   └── __tests__/
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── import/               # PGN, FEN, Chess.com, and Lichess import parsers
│   └── lib/                      # Shared utility functions and common helpers
├── eslint.config.mjs             # Next.js flat ESLint configuration
├── .prettierrc                   # Prettier formatting rules with Tailwind v4 plugin
├── .env.example                  # Environment variable schema
├── vitest.config.ts              # Vitest unit test runner config
└── playwright.config.ts          # Playwright test config
```

### Feature Module Standard Anatomy

Each domain module in `src/features/<feature>/` adheres to the following organization:

- `components/` — UI components specific to the feature.
- `hooks/` — React hooks for state and lifecycle binding.
- `logic/` — Pure functions containing deterministic business rules (100% testable).
- `__tests__/` — Vitest unit tests co-located with pure logic.
- `types.ts` — TypeScript domain types, schemas, and enums.
- `index.ts` — Public barrel export (must never export browser worker files).
