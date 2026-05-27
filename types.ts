export type SportType = 'football' | 'basketball' | 'archery' | 'tennis' | 'sprint' | 'weightlifting';

export type SpanishTense = 'indefinido' | 'imperfecto' | 'perfecto';

export interface Player {
  id: 1 | 2;
  name: string;
  score: number;
  avatar: string; // emoji or avatar name
  country: 'ARM' | 'ESP';
  scoresBySport: Record<SportType, number>;
}

export interface VerbQuestion {
  id: string;
  verbSpanish: string; // e.g., "hablar"
  verbArmenian: string; // e.g., "խոսել"
  tense: SpanishTense;
  tenseNameArm: string; // e.g., "Անցյալ կատարյալ" (Indefinido) | "Անցյալ անկատար" (Imperfecto) | "Վաղակատար անցյալ" (Perfecto)
  pronounArm: string; // e.g., "ես", "դու", "նա", "մենք", "դուք", "նրանք"
  pronounEsp: string; // e.g., "yo", "tú", "él/ella", "nosotros", "vosotros", "ellos/ellas"
  armenianPhrase: string; // e.g., "ես խոսեցի"
  correctAnswer: string; // e.g., "hablé"
  options: string[]; // 4 shuffled options
  hint: string;
}

export interface GameState {
  players: [Player, Player];
  activePlayerIndex: number; // 0 or 1
  currentSport: SportType | null; // null represents menu / screens
  sportPhase: 'intro' | 'playing' | 'turn_transition' | 'summary' | 'completed';
  leaderboard: { name: string; score: number; date: string }[];
  currentRound: number; // 1 to 6
}
