export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          rating_estimate: number;
          preferred_persona: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          rating_estimate?: number;
          preferred_persona?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          rating_estimate?: number;
          preferred_persona?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      games: {
        Row: {
          id: string;
          user_id: string;
          source: string;
          pgn: string;
          result: string | null;
          time_control: string | null;
          played_at: string;
          analysis_json: Json | null;
          imported_ref: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          source?: string;
          pgn: string;
          result?: string | null;
          time_control?: string | null;
          played_at?: string;
          analysis_json?: Json | null;
          imported_ref?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          source?: string;
          pgn?: string;
          result?: string | null;
          time_control?: string | null;
          played_at?: string;
          analysis_json?: Json | null;
          imported_ref?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'games_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      companion_sessions: {
        Row: {
          id: string;
          game_id: string;
          persona: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          game_id: string;
          persona?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          game_id?: string;
          persona?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'companion_sessions_game_id_fkey';
            columns: ['game_id'];
            referencedRelation: 'games';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
