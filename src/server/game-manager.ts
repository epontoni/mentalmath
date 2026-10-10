// In-Memory Authoritative Multiplayer Game Manager
// Handles rooms, state transitions, authoritative timers, scoring, and reconnects

import { Server as SocketIOServer } from 'socket.io';
import { 
  RoomState, 
  Player, 
  QuestionData, 
  ClientQuestion, 
  RoomSettings, 
  PlayerRoundResult, 
  LeaderboardEntry,
  GameStatus 
} from '@/types/game';
import { generateQuestionSet } from '@/lib/math-generator';

export class GameManager {
  private io: SocketIOServer;
  private rooms: Map<string, RoomState> = new Map();
  private roomTimers: Map<string, NodeJS.Timeout> = new Map();
  private countdownTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor(io: SocketIOServer) {
    this.io = io;
  }

  // Generate unique 6-character PIN (e.g. "849201" or "M7K9P2")
  public generatePin(): string {
    let pin: string;
    do {
      pin = Math.floor(100000 + Math.random() * 900000).toString();
    } while (this.rooms.has(pin));
    return pin;
  }

  // Create a new room
  public createRoom(
    hostSocketId: string, 
    hostId: string, 
    settings: RoomSettings, 
    customQuestions?: QuestionData[]
  ): RoomState {
    const pin = this.generatePin();
    const questions = customQuestions && customQuestions.length > 0 
      ? customQuestions 
      : generateQuestionSet(
          settings.totalRounds, 
          settings.operations, 
          settings.difficulty, 
          settings.timePerQuestion
        );

    const roomState: RoomState = {
      pin,
      hostId,
      hostSocketId,
      status: 'LOBBY',
      settings: {
        ...settings,
        totalRounds: questions.length,
        autoAdvance: settings.autoAdvance ?? true,
        autoAdvanceDelaySec: settings.autoAdvanceDelaySec ?? 4,
        hostPlays: settings.hostPlays ?? false,
        hostNickname: settings.hostNickname
      },
      questions,
      currentQuestionIndex: 0,
      players: {},
      roundStartedAt: null,
      roundTimerDuration: settings.timePerQuestion,
      createdAt: Date.now()
    };

    // If host chose to play as participant, register host as player 1
    if (settings.hostPlays && settings.hostNickname) {
      const hostPlayerId = `host_p_${Date.now()}`;
      const hostToken = `token_${Math.random().toString(36).substring(2)}`;
      roomState.players[hostPlayerId] = {
        id: hostPlayerId,
        socketId: hostSocketId,
        nickname: settings.hostNickname.trim(),
        avatar: 'brain',
        score: 0,
        streak: 0,
        highestStreak: 0,
        correctAnswersCount: 0,
        totalAnswersCount: 0,
        isConnected: true,
        lastSeenAt: Date.now(),
        sessionToken: hostToken,
        hasAnsweredCurrentRound: false
      };
      roomState.hostPlayerId = hostPlayerId;
    }

    this.rooms.set(pin, roomState);
    return roomState;
  }

  public getRoom(pin: string): RoomState | undefined {
    return this.rooms.get(pin);
  }

  // Add or restore player in room
  public joinPlayer(
    pin: string, 
    socketId: string, 
    nickname: string, 
    avatar: string = 'brain', 
    existingPlayerId?: string,
    existingSessionToken?: string
  ): { player: Player; isReconnection: boolean } | { error: string } {
    const room = this.rooms.get(pin);
    if (!room) {
      return { error: 'Sala no encontrada. Verifica el código PIN.' };
    }

    if (room.status !== 'LOBBY' && room.status !== 'GAME_OVER' && !room.settings.allowLateJoin && !existingPlayerId) {
      return { error: 'La partida ya está en curso.' };
    }

    // Check if player is reconnecting with an existing ID
    if (existingPlayerId && room.players[existingPlayerId]) {
      const player = room.players[existingPlayerId];
      if (existingSessionToken && player.sessionToken !== existingSessionToken) {
        return { error: 'Token de sesión inválido.' };
      }
      player.socketId = socketId;
      player.isConnected = true;
      player.lastSeenAt = Date.now();
      return { player, isReconnection: true };
    }

    // New Player
    const playerId = `p_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const sessionToken = `tok_${Math.random().toString(36).substring(2, 15)}`;

    const newPlayer: Player = {
      id: playerId,
      socketId,
      nickname: nickname.trim().substring(0, 16) || `Jugador ${Object.keys(room.players).length + 1}`,
      avatar,
      score: 0,
      streak: 0,
      highestStreak: 0,
      correctAnswersCount: 0,
      totalAnswersCount: 0,
      isConnected: true,
      lastSeenAt: Date.now(),
      sessionToken,
      hasAnsweredCurrentRound: false
    };

    room.players[playerId] = newPlayer;
    return { player: newPlayer, isReconnection: false };
  }

  // Explicitly remove player when leaving room
  public leavePlayer(pin: string, playerId: string): { success: boolean; nickname?: string; playersList?: Player[] } {
    const room = this.rooms.get(pin);
    if (!room || !room.players[playerId]) {
      return { success: false };
    }

    const nickname = room.players[playerId].nickname;
    delete room.players[playerId];

    const playersList = Object.values(room.players);

    // Broadcast updated state to all clients in room
    this.io.to(pin).emit('player_left', {
      playerId,
      nickname,
      isDisconnected: false,
      totalPlayers: playersList.length,
      playersList
    });

    // If a question was active, re-check remaining players answer progress
    if (room.status === 'QUESTION_ACTIVE') {
      const activePlayers = playersList.filter(p => p.isConnected);
      const answeredCount = activePlayers.filter(p => p.hasAnsweredCurrentRound).length;

      this.io.to(pin).emit('player_answered', {
        playerId,
        nickname,
        answeredCount,
        totalActivePlayers: activePlayers.length
      });

      if (activePlayers.length > 0 && activePlayers.every(p => p.hasAnsweredCurrentRound)) {
        this.endRound(pin);
      }
    }

    return { success: true, nickname, playersList };
  }

  // Reconnect Player
  public reconnectPlayer(
    pin: string, 
    playerId: string, 
    sessionToken: string, 
    newSocketId: string
  ): { player: Player; roomState: RoomState } | { error: string } {
    const room = this.rooms.get(pin);
    if (!room) {
      return { error: 'Sala no encontrada.' };
    }

    const player = room.players[playerId];
    if (!player) {
      return { error: 'Jugador no encontrado en la sala.' };
    }

    if (player.sessionToken !== sessionToken) {
      return { error: 'Token de sesión no coincide.' };
    }

    player.socketId = newSocketId;
    player.isConnected = true;
    player.lastSeenAt = Date.now();

    return { player, roomState: room };
  }

  // Handle Socket Disconnect
  public handleDisconnect(socketId: string): { pin?: string; playerId?: string; isHost?: boolean } {
    for (const [pin, room] of this.rooms.entries()) {
      if (room.hostSocketId === socketId) {
        // Host disconnected - notify all players in room
        this.io.to(pin).emit('host_disconnected', {
          message: 'El anfitrión se ha desconectado. Esperando reconexión...'
        });
        return { pin, isHost: true };
      }

      for (const [playerId, player] of Object.entries(room.players)) {
        if (player.socketId === socketId) {
          player.isConnected = false;
          player.lastSeenAt = Date.now();

          const playersList = Object.values(room.players);
          this.io.to(pin).emit('player_left', {
            playerId,
            nickname: player.nickname,
            isDisconnected: true,
            totalPlayers: playersList.filter(p => p.isConnected).length,
            playersList
          });

          return { pin, playerId, isHost: false };
        }
      }
    }
    return {};
  }

  // Start Game with 3-2-1 Synchronized Countdown
  public startGame(pin: string): boolean {
    const room = this.rooms.get(pin);
    if (!room || (room.status !== 'LOBBY' && room.status !== 'GAME_OVER')) return false;

    room.status = 'STARTING';
    room.currentQuestionIndex = 0;

    // Reset players scores if restarting
    Object.values(room.players).forEach(p => {
      p.score = 0;
      p.streak = 0;
      p.highestStreak = 0;
      p.correctAnswersCount = 0;
      p.totalAnswersCount = 0;
      p.hasAnsweredCurrentRound = false;
      p.currentAnswer = null;
    });

    const countdownSec = 3;
    const startedAt = Date.now();

    this.io.to(pin).emit('game_starting', {
      countdownSec,
      totalRounds: room.questions.length,
      startedAt
    });

    // Start Question 1 after countdown
    const timeout = setTimeout(() => {
      this.sendQuestion(pin, 0);
    }, countdownSec * 1000);

    this.countdownTimers.set(pin, timeout);
    return true;
  }

  // Send Question to Room
  public sendQuestion(pin: string, questionIndex: number) {
    const room = this.rooms.get(pin);
    if (!room) return;

    if (questionIndex >= room.questions.length) {
      this.finishGame(pin);
      return;
    }

    // Clear existing timers
    this.clearRoomTimer(pin);

    room.status = 'QUESTION_ACTIVE';
    room.currentQuestionIndex = questionIndex;
    room.roundStartedAt = Date.now();
    const currentQ = room.questions[questionIndex];
    room.roundTimerDuration = currentQ.timeLimitSec;

    // Reset round answer state for all players
    Object.values(room.players).forEach(p => {
      p.hasAnsweredCurrentRound = false;
      p.currentAnswer = null;
      p.currentResponseTimeMs = undefined;
      p.currentPointsEarned = 0;
      p.currentIsCorrect = false;
    });

    const clientQuestion: ClientQuestion = {
      id: currentQ.id,
      questionNumber: questionIndex + 1,
      totalQuestions: room.questions.length,
      expression: currentQ.expression,
      timeLimitSec: currentQ.timeLimitSec,
      serverStartedAt: room.roundStartedAt,
      operationType: currentQ.operationType
    };

    // Broadcast question to Host and all Players in the room
    this.io.to(pin).emit('new_question', clientQuestion);

    // Start authoritative timer interval
    let remaining = currentQ.timeLimitSec;
    const interval = setInterval(() => {
      remaining -= 1;
      this.io.to(pin).emit('time_tick', {
        remainingSec: Math.max(0, remaining),
        totalSec: currentQ.timeLimitSec,
        serverTime: Date.now()
      });

      if (remaining <= 0) {
        this.clearRoomTimer(pin);
        this.endRound(pin);
      }
    }, 1000);

    this.roomTimers.set(pin, interval);
  }

  // Submit Answer
  public submitAnswer(
    pin: string, 
    playerId: string, 
    questionId: string, 
    answer: number
  ): { success: boolean; error?: string } {
    const room = this.rooms.get(pin);
    if (!room || room.status !== 'QUESTION_ACTIVE' || !room.roundStartedAt) {
      return { success: false, error: 'La ronda no está activa para responder.' };
    }

    const player = room.players[playerId];
    if (!player) {
      return { success: false, error: 'Jugador no encontrado.' };
    }

    if (player.hasAnsweredCurrentRound) {
      return { success: false, error: 'Ya has enviado una respuesta para esta pregunta.' };
    }

    const currentQ = room.questions[room.currentQuestionIndex];
    if (currentQ.id !== questionId) {
      return { success: false, error: 'ID de pregunta no coincide con la ronda actual.' };
    }

    // Authoritative response time calculation (Milliseconds from server question dispatch)
    const now = Date.now();
    const responseTimeMs = Math.max(10, now - room.roundStartedAt);
    const totalTimeMs = currentQ.timeLimitSec * 1000;
    
    // Check if within time limit (with small 500ms network latency margin)
    if (responseTimeMs > totalTimeMs + 500) {
      return { success: false, error: 'El tiempo se ha agotado.' };
    }

    const isCorrect = Number(answer) === Number(currentQ.correctAnswer);
    player.hasAnsweredCurrentRound = true;
    player.currentAnswer = answer;
    player.currentResponseTimeMs = responseTimeMs;
    player.totalAnswersCount += 1;

    let points = 0;
    if (isCorrect) {
      player.correctAnswersCount += 1;
      player.streak += 1;
      if (player.streak > player.highestStreak) {
        player.highestStreak = player.streak;
      }

      // Formula: Score = 1000 * (1 - (time_elapsed / total_time) * 0.5)
      // Faster response gives up to 1000 pts; slowest correct answer near deadline gives 500 pts.
      const timeRatio = Math.min(1, Math.max(0, responseTimeMs / totalTimeMs));
      const basePoints = Math.round(1000 * (1 - timeRatio * 0.5));
      
      // Streak bonus: +50 points per streak level (capped at +250)
      const streakBonus = Math.min(250, (player.streak - 1) * 50);
      points = basePoints + streakBonus;

      player.score += points;
      player.currentPointsEarned = points;
      player.currentIsCorrect = true;
    } else {
      player.streak = 0;
      player.currentPointsEarned = 0;
      player.currentIsCorrect = false;
    }

    // Notify Host about player submission (without revealing the actual answer)
    const activeConnectedPlayers = Object.values(room.players).filter(p => p.isConnected);
    const answeredCount = activeConnectedPlayers.filter(p => p.hasAnsweredCurrentRound).length;

    this.io.to(pin).emit('player_answered', {
      playerId: player.id,
      nickname: player.nickname,
      answeredCount,
      totalActivePlayers: activeConnectedPlayers.length
    });

    // If ALL connected active players have answered, end round early!
    if (answeredCount >= activeConnectedPlayers.length && activeConnectedPlayers.length > 0) {
      this.clearRoomTimer(pin);
      // Small 300ms pause for visual smoothness
      setTimeout(() => {
        this.endRound(pin);
      }, 300);
    }

    return { success: true };
  }

  // End Round and Calculate Results
  public endRound(pin: string) {
    const room = this.rooms.get(pin);
    if (!room || room.status !== 'QUESTION_ACTIVE') return;

    this.clearRoomTimer(pin);
    room.status = 'ROUND_FEEDBACK';

    const currentQ = room.questions[room.currentQuestionIndex];
    const isLastQuestion = room.currentQuestionIndex >= room.questions.length - 1;

    // Collect player results
    const playerResults: PlayerRoundResult[] = Object.values(room.players).map(p => ({
      playerId: p.id,
      nickname: p.nickname,
      avatar: p.avatar,
      answer: p.currentAnswer ?? null,
      isCorrect: p.currentIsCorrect ?? false,
      pointsEarned: p.currentPointsEarned ?? 0,
      totalScore: p.score,
      responseTimeMs: p.currentResponseTimeMs ?? 0,
      streak: p.streak
    }));

    const leaderboard = this.getLeaderboard(pin);

    const autoAdvanceDelay = room.settings.autoAdvanceDelaySec || 4;

    const roundResultsData = {
      questionNumber: room.currentQuestionIndex + 1,
      totalQuestions: room.questions.length,
      questionId: currentQ.id,
      expression: currentQ.expression,
      correctAnswer: currentQ.correctAnswer,
      explanation: currentQ.explanation,
      playerResults,
      leaderboard,
      isLastQuestion,
      autoAdvance: Boolean(room.settings.autoAdvance),
      autoAdvanceDelaySec: autoAdvanceDelay
    };

    room.lastRoundResults = roundResultsData;
    this.io.to(pin).emit('round_ended', roundResultsData);

    // If autoAdvance is enabled and not the last question, automatically schedule next question
    if (room.settings.autoAdvance && !isLastQuestion) {
      const autoTimeout = setTimeout(() => {
        const currentRoom = this.rooms.get(pin);
        if (currentRoom && currentRoom.status === 'ROUND_FEEDBACK') {
          this.nextQuestion(pin);
        }
      }, autoAdvanceDelay * 1000);
      this.roomTimers.set(pin, autoTimeout);
    }
  }

  // Advance to Next Question
  public nextQuestion(pin: string) {
    const room = this.rooms.get(pin);
    if (!room) return;

    this.clearRoomTimer(pin);
    room.lastRoundResults = null;

    if (room.currentQuestionIndex + 1 < room.questions.length) {
      this.sendQuestion(pin, room.currentQuestionIndex + 1);
    } else {
      this.finishGame(pin);
    }
  }

  // Finish Game & Grand Podium
  public finishGame(pin: string) {
    const room = this.rooms.get(pin);
    if (!room) return;

    this.clearRoomTimer(pin);
    room.status = 'GAME_OVER';

    const fullLeaderboard = this.getLeaderboard(pin);
    const podium = fullLeaderboard.slice(0, 3);

    const gameOverPayload = {
      pin,
      totalQuestions: room.questions.length,
      podium,
      fullLeaderboard
    };

    room.lastGameOverData = gameOverPayload;
    this.io.to(pin).emit('game_over', gameOverPayload);
  }

  // Helper: Compute Leaderboard sorted by score and accuracy
  public getLeaderboard(pin: string): LeaderboardEntry[] {
    const room = this.rooms.get(pin);
    if (!room) return [];

    const sortedPlayers = Object.values(room.players).sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.correctAnswersCount - a.correctAnswersCount;
    });

    return sortedPlayers.map((p, idx) => ({
      rank: idx + 1,
      playerId: p.id,
      nickname: p.nickname,
      avatar: p.avatar,
      score: p.score,
      streak: p.streak,
      correctAnswers: p.correctAnswersCount,
      totalAnswers: p.totalAnswersCount,
      accuracy: p.totalAnswersCount > 0 ? Math.round((p.correctAnswersCount / p.totalAnswersCount) * 100) : 0,
      isConnected: p.isConnected
    }));
  }

  // Clear timers
  private clearRoomTimer(pin: string) {
    const timer = this.roomTimers.get(pin);
    if (timer) {
      clearInterval(timer);
      this.roomTimers.delete(pin);
    }
    const cdTimer = this.countdownTimers.get(pin);
    if (cdTimer) {
      clearTimeout(cdTimer);
      this.countdownTimers.delete(pin);
    }
  }

  // Delete Room
  public deleteRoom(pin: string) {
    this.clearRoomTimer(pin);
    this.rooms.delete(pin);
  }

  // Reset Room to LOBBY to play again with same connected participants
  public resetRoom(pin: string): { success: boolean; error?: string } {
    const room = this.rooms.get(pin);
    if (!room) return { success: false, error: 'Sala no encontrada' };

    this.clearRoomTimer(pin);

    room.status = 'LOBBY';
    room.currentQuestionIndex = 0;
    room.lastRoundResults = null;
    room.lastGameOverData = null;

    // Reset scores & streaks for all participants
    Object.values(room.players).forEach(p => {
      p.score = 0;
      p.streak = 0;
      p.highestStreak = 0;
      p.correctAnswersCount = 0;
      p.totalAnswersCount = 0;
      p.hasAnsweredCurrentRound = false;
      p.currentAnswer = null;
    });

    // If procedural mode, generate a fresh question set
    if (room.settings.mode === 'PROCEDURAL') {
      room.questions = generateQuestionSet(
        room.settings.totalRounds,
        room.settings.operations,
        room.settings.difficulty,
        room.settings.timePerQuestion
      );
    }

    const playersList = Object.values(room.players);

    // Broadcast synchronized room_reset to all players and host
    this.io.to(pin).emit('room_reset', {
      pin,
      status: 'LOBBY',
      playersList,
      settings: room.settings
    });

    return { success: true };
  }

  // Explicitly close room & notify all players
  public closeRoom(pin: string, reason: string = 'El anfitrión ha cerrado la sala.'): { success: boolean } {
    const room = this.rooms.get(pin);
    if (!room) return { success: false };

    this.clearRoomTimer(pin);

    // Broadcast room_closed immediately to everyone in the room
    this.io.to(pin).emit('room_closed', {
      pin,
      reason
    });

    this.rooms.delete(pin);
    return { success: true };
  }
}
