'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  Player, 
  PlayerRoundResult,
  ClientQuestion, 
  GameStatus, 
  RoomSettings, 
  RoundEndedPayload, 
  GameOverPayload, 
  LeaderboardEntry, 
  QuestionData 
} from '@/types/game';
import { sounds } from '@/lib/sound';

export interface StoredSession {
  pin: string;
  playerId: string;
  nickname: string;
  sessionToken: string;
  avatar?: string;
  isHost?: boolean;
}

export const SESSION_STORAGE_KEY = 'mentalmath_active_session';

export const getActiveGameSession = (): StoredSession | null => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const clearActiveGameSession = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_STORAGE_KEY);
};

export function useGameSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [gameStatus, setGameStatus] = useState<GameStatus>('LOBBY');
  const [storedSession, setStoredSession] = useState<StoredSession | null>(null);
  
  // Player state
  const [player, setPlayer] = useState<Player | null>(null);
  const [playersList, setPlayersList] = useState<Player[]>([]);
  const [currentPin, setCurrentPin] = useState<string>('');
  const [roomSettings, setRoomSettings] = useState<RoomSettings | null>(null);

  // Active question & timer state
  const [currentQuestion, setCurrentQuestion] = useState<ClientQuestion | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [timeTotal, setTimeTotal] = useState<number>(10);
  const [hasAnsweredCurrentRound, setHasAnsweredCurrentRound] = useState<boolean>(false);
  const [submittedAnswer, setSubmittedAnswer] = useState<number | null>(null);

  // Results & Podium
  const [roundResults, setRoundResults] = useState<RoundEndedPayload | null>(null);
  const [gameOverData, setGameOverData] = useState<GameOverPayload | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Read stored session on client mount
  useEffect(() => {
    setStoredSession(getActiveGameSession());
  }, []);

  // Save session to localStorage
  const saveSession = (session: StoredSession) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    }
    setStoredSession(session);
  };

  // Get session from localStorage
  const getStoredSession = (): StoredSession | null => {
    return getActiveGameSession();
  };

  // Clear session
  const clearSession = () => {
    clearActiveGameSession();
    setStoredSession(null);
    setPlayer(null);
    setCurrentPin('');
    setGameStatus('LOBBY');
    setCurrentQuestion(null);
    setRoundResults(null);
    setGameOverData(null);
  };

  // Initialize Socket connection
  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || (typeof window !== 'undefined' ? window.location.origin : undefined);
    const socket = io(socketUrl, {
      path: '/socket.io',
      transports: ['polling', 'websocket'],
      reconnectionAttempts: 30,
      reconnectionDelay: 1000,
      timeout: 20000,
      withCredentials: true
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[useGameSocket] Conectado exitosamente:', socket.id);
      setIsConnected(true);
      setError(null);

      // Auto-reconnect if local session exists
      const saved = getStoredSession();
      if (saved && saved.pin && saved.playerId && saved.sessionToken && !saved.isHost) {
        socket.emit('reconnect_player', {
          pin: saved.pin,
          playerId: saved.playerId,
          sessionToken: saved.sessionToken
        }, (res: { 
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
          }; 
          error?: string 
        }) => {
          if (res.success && res.player && res.roomState) {
            setPlayer(res.player);
            setCurrentPin(saved.pin);
            setGameStatus(res.roomState.status);
            setRoomSettings(res.roomState.settings);
            if (res.roomState.currentQuestion) {
              setCurrentQuestion(res.roomState.currentQuestion);
              setTimeRemaining(res.roomState.remainingSec || 0);
              setTimeTotal(res.roomState.currentQuestion.timeLimitSec);
              setHasAnsweredCurrentRound(res.roomState.hasAnswered || false);
            }
          } else {
            // Session expired or invalid
            clearSession();
          }
        });
      }
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.warn('Socket connection error:', err.message);
      setIsConnected(false);
      setError(`Error de conexión con el motor de juego: ${err.message}`);
    });

    // ----------------------------------------------------
    // Server Event Handlers
    // ----------------------------------------------------
    socket.on('player_joined', (data: { player: Player; totalPlayers: number; playersList: Player[] }) => {
      setPlayersList(data.playersList);
    });

    socket.on('player_left', (data: { playerId: string; nickname: string; isDisconnected: boolean; totalPlayers: number; playersList?: Player[] }) => {
      if (data.playersList) {
        setPlayersList(data.playersList);
      } else {
        setPlayersList(prev => prev.filter(p => p.id !== data.playerId));
      }
    });

    socket.on('player_reconnected', (data: { playerId: string; nickname: string; playersList: Player[] }) => {
      setPlayersList(data.playersList);
    });

    socket.on('game_starting', (data: { countdownSec: number; totalRounds: number; startedAt: number }) => {
      setGameStatus('STARTING');
      setCountdown(data.countdownSec);
      setRoundResults(null);
      setGameOverData(null);
      sounds.playCountdownTick(false);

      let count = data.countdownSec;
      const interval = setInterval(() => {
        count -= 1;
        if (count > 0) {
          setCountdown(count);
          sounds.playCountdownTick(false);
        } else {
          setCountdown(0);
          sounds.playCountdownTick(true);
          clearInterval(interval);
        }
      }, 1000);
    });

    socket.on('new_question', (question: ClientQuestion) => {
      setGameStatus('QUESTION_ACTIVE');
      setCountdown(null);
      setCurrentQuestion(question);
      setTimeRemaining(question.timeLimitSec);
      setTimeTotal(question.timeLimitSec);
      setHasAnsweredCurrentRound(false);
      setSubmittedAnswer(null);
      setRoundResults(null);
    });

    socket.on('time_tick', (data: { remainingSec: number; totalSec: number }) => {
      setTimeRemaining(data.remainingSec);
      setTimeTotal(data.totalSec);
      if (data.remainingSec <= 3 && data.remainingSec > 0) {
        sounds.playCountdownTick(false);
      }
    });

    socket.on('round_ended', (data: RoundEndedPayload) => {
      setGameStatus('ROUND_FEEDBACK');
      setRoundResults(data);
      setLeaderboard(data.leaderboard);

      // Check current player's result for audio feedback
      if (player) {
        const myResult = data.playerResults.find((r: PlayerRoundResult) => r.playerId === player.id);
        if (myResult) {
          setPlayer(prev => prev ? {
            ...prev,
            score: myResult.totalScore,
            streak: myResult.streak
          } : null);

          if (myResult.isCorrect) {
            sounds.playCorrect(myResult.streak);
          } else {
            sounds.playIncorrect();
          }
        }
      }
    });

    socket.on('game_over', (data: GameOverPayload) => {
      setGameStatus('GAME_OVER');
      setGameOverData(data);
      setLeaderboard(data.fullLeaderboard);
      sounds.playFanfare();
    });

    socket.on('room_reset', (data: { pin: string; status: GameStatus; playersList: Player[]; settings: RoomSettings }) => {
      setGameStatus('LOBBY');
      setPlayersList(data.playersList);
      setRoomSettings(data.settings);
      setCurrentQuestion(null);
      setRoundResults(null);
      setGameOverData(null);
      setCountdown(null);
      setHasAnsweredCurrentRound(false);
      setSubmittedAnswer(null);
      setTimeRemaining(0);
      setError(null);
    });

    socket.on('room_closed', (data: { pin: string; reason: string }) => {
      clearSession();
      setError(data.reason || 'El anfitrión ha cerrado la sala.');
    });

    socket.on('host_disconnected', (data: { message: string }) => {
      setError(data.message || 'El anfitrión se ha desconectado.');
    });

    socket.on('error_message', (data: { code: string; message: string }) => {
      setError(data.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // ----------------------------------------------------
  // Client Action Methods
  // ----------------------------------------------------
  const createRoom = useCallback((settings: RoomSettings, customQuestions?: QuestionData[]): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current) return reject(new Error('Socket no conectado'));
      const hostId = `host_${Date.now()}`;
      socketRef.current.emit('create_room', { hostId, settings, customQuestions }, (res: { success: boolean; pin?: string; hostPlayer?: Player; error?: string }) => {
        if (res.success && res.pin) {
          setCurrentPin(res.pin);
          setRoomSettings(settings);
          if (res.hostPlayer) {
            setPlayer(res.hostPlayer);
            saveSession({
              pin: res.pin,
              playerId: res.hostPlayer.id,
              nickname: res.hostPlayer.nickname,
              sessionToken: res.hostPlayer.sessionToken,
              isHost: true
            });
          } else {
            saveSession({
              pin: res.pin,
              playerId: hostId,
              nickname: 'Host',
              sessionToken: 'host_token',
              isHost: true
            });
          }
          resolve(res.pin);
        } else {
          reject(new Error(res.error || 'Error al crear la sala'));
        }
      });
    });
  }, []);

  const joinRoom = useCallback((pin: string, nickname: string, avatar: string = 'brain'): Promise<Player> => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current) return reject(new Error('Socket no conectado'));
      const cleanPin = pin.trim();
      const cleanNick = nickname.trim();

      socketRef.current.emit('join_room', { pin: cleanPin, nickname: cleanNick, avatar }, (res: {
        success: boolean;
        player?: Player;
        status?: GameStatus;
        roomSettings?: RoomSettings;
        error?: string;
      }) => {
        if (res.success && res.player) {
          setPlayer(res.player);
          setCurrentPin(cleanPin);
          if (res.status) setGameStatus(res.status);
          if (res.roomSettings) setRoomSettings(res.roomSettings);
          saveSession({
            pin: cleanPin,
            playerId: res.player.id,
            nickname: res.player.nickname,
            sessionToken: res.player.sessionToken,
            avatar: res.player.avatar,
            isHost: false
          });
          resolve(res.player);
        } else {
          reject(new Error(res.error || 'Error al unirse a la sala'));
        }
      });
    });
  }, []);

  const submitAnswer = useCallback((answer: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current || !player || !currentQuestion || !currentPin) {
        return reject(new Error('Estado inválido para enviar respuesta'));
      }
      setHasAnsweredCurrentRound(true);
      setSubmittedAnswer(answer);
      sounds.playSubmit();

      socketRef.current.emit('submit_answer', {
        pin: currentPin,
        playerId: player.id,
        questionId: currentQuestion.id,
        answer,
        clientTimestamp: Date.now()
      }, (res: { success: boolean; error?: string }) => {
        if (res.success) {
          resolve(true);
        } else {
          setHasAnsweredCurrentRound(false);
          reject(new Error(res.error || 'Error al enviar respuesta'));
        }
      });
    });
  }, [player, currentQuestion, currentPin]);

  const startGame = useCallback((pin: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit('start_game', { pin });
  }, []);

  const nextQuestion = useCallback((pin: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit('next_question', { pin });
  }, []);

  const kickPlayer = useCallback((pin: string, playerId: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit('kick_player', { pin, playerId });
  }, []);

  const leaveRoom = useCallback(() => {
    if (socketRef.current && currentPin && player) {
      socketRef.current.emit('leave_room', { pin: currentPin, playerId: player.id });
    }
    clearSession();
  }, [currentPin, player]);

  const reconnectHost = useCallback((pin: string, isProjector: boolean = false): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!socketRef.current) return resolve(false);
      socketRef.current.emit('host_reconnect', { pin, hostId: 'host_session', isProjector }, (res: {
        success: boolean;
        roomState?: {
          pin: string;
          status: GameStatus;
          settings: RoomSettings;
          currentQuestion: ClientQuestion | null;
          players: Player[];
          leaderboard: LeaderboardEntry[];
          hostPlayer?: Player;
          roundResults?: RoundEndedPayload | null;
          gameOverData?: GameOverPayload | null;
        };
        error?: string;
      }) => {
        if (res.success && res.roomState) {
          setCurrentPin(res.roomState.pin);
          setGameStatus(res.roomState.status);
          setRoomSettings(res.roomState.settings);
          setPlayersList(res.roomState.players || []);
          if (res.roomState.hostPlayer) {
            setPlayer(res.roomState.hostPlayer);
          }
          if (res.roomState.currentQuestion) {
            setCurrentQuestion(res.roomState.currentQuestion);
          }
          if (res.roomState.leaderboard) {
            setLeaderboard(res.roomState.leaderboard);
          }
          if (res.roomState.roundResults) {
            setRoundResults(res.roomState.roundResults);
          }
          if (res.roomState.gameOverData) {
            setGameOverData(res.roomState.gameOverData);
          }
          setError(null);
          resolve(true);
        } else {
          clearSession();
          setError(res.error || 'La sala ya no existe o ha expirado.');
          resolve(false);
        }
      });
    });
  }, []);

  const reconnectExistingSession = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      const saved = getStoredSession();
      if (!saved || !socketRef.current || !saved.pin) return resolve(false);

      if (saved.isHost) {
        reconnectHost(saved.pin).then(resolve);
      } else {
        socketRef.current.emit('reconnect_player', {
          pin: saved.pin,
          playerId: saved.playerId,
          sessionToken: saved.sessionToken
        }, (res: { 
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
        }) => {
          if (res.success && res.player && res.roomState) {
            setPlayer(res.player);
            setCurrentPin(saved.pin);
            setGameStatus(res.roomState.status);
            setRoomSettings(res.roomState.settings);
            if (res.roomState.currentQuestion) {
              setCurrentQuestion(res.roomState.currentQuestion);
              setTimeRemaining(res.roomState.remainingSec || 0);
              setTimeTotal(res.roomState.currentQuestion.timeLimitSec);
              setHasAnsweredCurrentRound(res.roomState.hasAnswered || false);
            }
            if (res.roomState.roundResults) {
              setRoundResults(res.roomState.roundResults);
            }
            if (res.roomState.gameOverData) {
              setGameOverData(res.roomState.gameOverData);
            }
            setError(null);
            resolve(true);
          } else {
            clearSession();
            setError(res.error || 'La partida ya no existe o ha expirado.');
            resolve(false);
          }
        });
      }
    });
  }, [reconnectHost]);

  const resetRoom = useCallback((pin: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current) return reject(new Error('Socket no conectado'));
      socketRef.current.emit('reset_room', { pin }, (res: { success: boolean; error?: string }) => {
        if (res && res.success) {
          setGameStatus('LOBBY');
          setCurrentQuestion(null);
          setRoundResults(null);
          setGameOverData(null);
          setCountdown(null);
          setHasAnsweredCurrentRound(false);
          setSubmittedAnswer(null);
          setTimeRemaining(0);
          resolve(true);
        } else {
          reject(new Error(res?.error || 'Error al reiniciar la sala'));
        }
      });
    });
  }, []);

  const closeRoom = useCallback((pin: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!socketRef.current) return resolve(false);
      socketRef.current.emit('close_room', { pin }, () => {
        clearSession();
        resolve(true);
      });
    });
  }, []);

  const returnToLobbyWaiting = useCallback(() => {
    setGameStatus('LOBBY');
    setCurrentQuestion(null);
    setRoundResults(null);
    setGameOverData(null);
    setCountdown(null);
    setHasAnsweredCurrentRound(false);
    setSubmittedAnswer(null);
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    gameStatus,
    player,
    playersList,
    currentPin,
    roomSettings,
    currentQuestion,
    timeRemaining,
    timeTotal,
    hasAnsweredCurrentRound,
    submittedAnswer,
    roundResults,
    gameOverData,
    leaderboard,
    countdown,
    error,
    createRoom,
    joinRoom,
    reconnectHost,
    reconnectExistingSession,
    storedSession,
    submitAnswer,
    startGame,
    nextQuestion,
    kickPlayer,
    leaveRoom,
    clearSession,
    resetRoom,
    closeRoom,
    returnToLobbyWaiting
  };
}
