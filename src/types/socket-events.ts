import { 
  RoomSettings, 
  QuestionData, 
  ClientQuestion, 
  Player, 
  PlayerRoundResult, 
  LeaderboardEntry, 
  GameStatus,
  RoundEndedPayload,
  GameOverPayload
} from './game';

// ----------------------------------------------------
// Client to Server Events
// ----------------------------------------------------
export interface CreateRoomPayload {
  hostId: string;
  settings: RoomSettings;
  customQuestions?: QuestionData[];
}

export interface JoinRoomPayload {
  pin: string;
  nickname: string;
  avatar?: string;
  existingPlayerId?: string;
  sessionToken?: string;
}

export interface ReconnectPlayerPayload {
  pin: string;
  playerId: string;
  sessionToken: string;
}

export interface StartGamePayload {
  pin: string;
}

export interface SubmitAnswerPayload {
  pin: string;
  playerId: string;
  questionId: string;
  answer: number;
  clientTimestamp: number;
}

export interface NextQuestionPayload {
  pin: string;
}

export interface KickPlayerPayload {
  pin: string;
  playerId: string;
}

export interface ClientToServerEvents {
  create_room: (
    payload: CreateRoomPayload, 
    callback: (response: { success: boolean; pin?: string; error?: string }) => void
  ) => void;
  
  join_room: (
    payload: JoinRoomPayload, 
    callback: (response: { 
      success: boolean; 
      player?: Player; 
      status?: GameStatus; 
      roomSettings?: RoomSettings;
      error?: string 
    }) => void
  ) => void;
  
  reconnect_player: (
    payload: ReconnectPlayerPayload, 
    callback: (response: { 
      success: boolean; 
      player?: Player; 
      roomState?: {
        status: GameStatus;
        currentQuestion?: ClientQuestion | null;
        remainingSec?: number;
        hasAnswered?: boolean;
        settings: RoomSettings;
        score: number;
        streak: number;
        roundResults?: RoundEndedPayload | null;
        gameOverData?: GameOverPayload | null;
      }; 
      error?: string 
    }) => void
  ) => void;

  host_reconnect: (
    payload: { pin: string; hostId: string; isProjector?: boolean },
    callback: (response: { success: boolean; roomState?: any; error?: string }) => void
  ) => void;

  start_game: (payload: StartGamePayload) => void;
  
  submit_answer: (
    payload: SubmitAnswerPayload, 
    callback: (response: { success: boolean; error?: string }) => void
  ) => void;
  
  next_question: (payload: NextQuestionPayload) => void;
  
  kick_player: (payload: KickPlayerPayload) => void;
  
  leave_room: (payload: { pin: string; playerId: string }) => void;

  reset_room: (payload: { pin: string }, callback?: (response: { success: boolean; error?: string }) => void) => void;

  close_room: (payload: { pin: string }, callback?: (response: { success: boolean; error?: string }) => void) => void;
}

// ----------------------------------------------------
// Server to Client Events
// ----------------------------------------------------
export interface GameStartingPayload {
  countdownSec: number;
  totalRounds: number;
  startedAt: number;
}

export interface TimeTickPayload {
  remainingSec: number;
  totalSec: number;
  serverTime: number;
}

export interface PlayerAnsweredBroadcastPayload {
  playerId: string;
  nickname: string;
  answeredCount: number;
  totalActivePlayers: number;
}

export interface ServerToClientEvents {
  // Lobby Events
  player_joined: (payload: { player: Player; totalPlayers: number; playersList: Player[] }) => void;
  player_left: (payload: { playerId: string; nickname: string; isDisconnected: boolean; totalPlayers: number; playersList: Player[] }) => void;
  player_reconnected: (payload: { playerId: string; nickname: string; playersList: Player[] }) => void;
  room_settings_updated: (payload: { settings: RoomSettings }) => void;
  room_reset: (payload: { pin: string; status: GameStatus; playersList: Player[]; settings: RoomSettings }) => void;
  room_closed: (payload: { pin: string; reason: string }) => void;

  // Game Lifecycle Events
  game_starting: (payload: GameStartingPayload) => void;
  new_question: (payload: ClientQuestion) => void;
  time_tick: (payload: TimeTickPayload) => void;
  player_answered: (payload: PlayerAnsweredBroadcastPayload) => void;
  
  // Feedback & Results
  answer_accepted: (payload: { questionId: string; responseTimeMs: number }) => void;
  round_ended: (payload: RoundEndedPayload) => void;
  game_over: (payload: GameOverPayload) => void;

  // Errors & Status
  host_disconnected: (payload: { message: string }) => void;
  game_cancelled: (payload: { reason: string }) => void;
  error_message: (payload: { code: string; message: string }) => void;
}
