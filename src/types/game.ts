// Core Data Models for Game State, Questions, and Players

export type GameStatus = 'LOBBY' | 'STARTING' | 'QUESTION_ACTIVE' | 'ROUND_FEEDBACK' | 'GAME_OVER';

export type OperationType = 
  | 'ADDITION'
  | 'SUBTRACTION'
  | 'MULTIPLICATION'
  | 'DIVISION'
  | 'MULTIPLICATION_11'
  | 'COMPLEMENT_100'
  | 'SQUARE_5'
  | 'DISTRIBUTIVE'
  | 'DOUBLE_HALF'
  | 'MIXED';

export type GameDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'MASTER' | 'MEDIUM';

export interface Player {
  id: string;              // Persistent unique ID (stored in localStorage)
  socketId: string;        // Current ephemeral socket connection
  nickname: string;
  avatar: string;          // e.g. "brain", "lightning", "rocket", "star", "fire"
  score: number;
  streak: number;          // Consecutive correct answers
  highestStreak: number;
  correctAnswersCount: number;
  totalAnswersCount: number;
  isConnected: boolean;
  lastSeenAt: number;
  sessionToken: string;    // Auth token for seamless reconnection
  
  // Current active round state
  hasAnsweredCurrentRound: boolean;
  currentAnswer?: number | null;
  currentResponseTimeMs?: number;
  currentPointsEarned?: number;
  currentIsCorrect?: boolean;
}

export interface QuestionData {
  id: string;
  order: number;
  expression: string;       // e.g. "45 × 11" or "100 - 37"
  correctAnswer: number;    // Numerical result
  explanation?: string;     // Step-by-step breakdown
  timeLimitSec: number;
  operationType: OperationType;
  difficulty: GameDifficulty;
}

// Client-safe Question (Stripped of correctAnswer)
export interface ClientQuestion {
  id: string;
  questionNumber: number;
  totalQuestions: number;
  expression: string;
  timeLimitSec: number;
  serverStartedAt: number;
  operationType?: OperationType;
}

export interface RoomSettings {
  title: string;
  totalRounds: number;
  timePerQuestion: number;  // Seconds (e.g. 5, 10, 15, 20)
  difficulty: GameDifficulty;
  operations: OperationType[];
  allowLateJoin: boolean;
  autoAdvance?: boolean;    // Automatic progression to next question
  autoAdvanceDelaySec?: number; // Delay in seconds between rounds (e.g. 3, 4, 5)
  hostPlays?: boolean;      // Whether the host also plays and answers from their screen
  hostNickname?: string;    // Nickname for host player if hostPlays is true
}

export interface PlayerRoundResult {
  playerId: string;
  nickname: string;
  avatar: string;
  answer: number | null;
  isCorrect: boolean;
  pointsEarned: number;
  totalScore: number;
  responseTimeMs: number;
  streak: number;
}

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  nickname: string;
  avatar: string;
  score: number;
  streak: number;
  correctAnswers: number;
  totalAnswers: number;
  accuracy: number;
  isConnected: boolean;
}

export interface RoundEndedPayload {
  questionNumber: number;
  totalQuestions: number;
  questionId: string;
  expression: string;
  correctAnswer: number;
  explanation?: string;
  playerResults: PlayerRoundResult[];
  leaderboard: LeaderboardEntry[];
  isLastQuestion: boolean;
  autoAdvance?: boolean;
  autoAdvanceDelaySec?: number;
}

export interface GameOverPayload {
  pin: string;
  totalQuestions: number;
  podium: LeaderboardEntry[];
  fullLeaderboard: LeaderboardEntry[];
}

export interface RoomState {
  pin: string;
  hostId: string;
  hostSocketId: string;
  hostPlayerId?: string;
  status: GameStatus;
  settings: RoomSettings;
  questions: QuestionData[];
  currentQuestionIndex: number;
  players: Record<string, Player>; // Map of playerId -> Player
  roundStartedAt: number | null;
  roundTimerDuration: number;
  createdAt: number;
  lastRoundResults?: RoundEndedPayload | null;
  lastGameOverData?: GameOverPayload | null;
}

// Academy types
export interface AcademyTrickStep {
  stepNumber: number;
  title: string;
  explanation: string;
  exampleFormula: string;
  breakdown: Array<{
    text: string;
    highlight?: boolean;
    note?: string;
    color?: string;
  }>;
  visualHint?: string;
}

export interface AcademyTechniqueData {
  id: string;
  slug: string;
  title: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  difficulty: GameDifficulty;
  badgeIcon: string;
  steps: AcademyTrickStep[];
  drillPreset: {
    operations: OperationType[];
    timePerQuestion: number;
    questionCount: number;
  };
}
