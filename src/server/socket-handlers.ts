// Socket.IO event router and connection handler

import { Server as SocketIOServer, Socket } from 'socket.io';
import { GameManager } from './game-manager';
import {
  CreateRoomPayload,
  JoinRoomPayload,
  ReconnectPlayerPayload,
  StartGamePayload,
  SubmitAnswerPayload,
  NextQuestionPayload,
  KickPlayerPayload
} from '@/types/socket-events';
import { ClientQuestion, Player } from '@/types/game';

export function setupSocketHandlers(io: SocketIOServer, gameManager: GameManager) {
  io.on('connection', (socket: Socket) => {
    // --------------------------------------------------
    // Host: Create Room
    // --------------------------------------------------
    socket.on('create_room', (payload: CreateRoomPayload, callback) => {
      try {
        const room = gameManager.createRoom(
          socket.id, 
          payload.hostId, 
          payload.settings, 
          payload.customQuestions
        );
        socket.join(room.pin);

        const hostPlayer = room.hostPlayerId ? room.players[room.hostPlayerId] : undefined;

        if (typeof callback === 'function') {
          callback({ success: true, pin: room.pin, hostPlayer });
        }
      } catch (err: unknown) {
        const error = err as Error;
        if (typeof callback === 'function') {
          callback({ success: false, error: error.message || 'Error al crear la sala' });
        }
      }
    });

    // --------------------------------------------------
    // Host: Reconnect to Room
    // --------------------------------------------------
    socket.on('host_reconnect', (payload: { pin: string; hostId: string; isProjector?: boolean }, callback) => {
      const room = gameManager.getRoom(payload.pin);
      if (!room) {
        if (typeof callback === 'function') {
          callback({ success: false, error: 'Sala no encontrada o ha expirado' });
        }
        return;
      }

      let hostPlayer: Player | undefined;
      if (!payload.isProjector) {
        room.hostSocketId = socket.id;
        if (room.hostPlayerId && room.players[room.hostPlayerId]) {
          room.players[room.hostPlayerId].socketId = socket.id;
          room.players[room.hostPlayerId].isConnected = true;
          hostPlayer = room.players[room.hostPlayerId];
        }
      } else {
        if (room.hostPlayerId && room.players[room.hostPlayerId]) {
          hostPlayer = room.players[room.hostPlayerId];
        }
      }
      socket.join(payload.pin);

      const activeQuestion = room.status === 'QUESTION_ACTIVE' && room.questions[room.currentQuestionIndex]
        ? {
            id: room.questions[room.currentQuestionIndex].id,
            questionNumber: room.currentQuestionIndex + 1,
            totalQuestions: room.questions.length,
            expression: room.questions[room.currentQuestionIndex].expression,
            timeLimitSec: room.questions[room.currentQuestionIndex].timeLimitSec,
            serverStartedAt: room.roundStartedAt || Date.now(),
            operationType: room.questions[room.currentQuestionIndex].operationType,
            options: room.questions[room.currentQuestionIndex].options
          }
        : null;

      if (typeof callback === 'function') {
        callback({
          success: true,
          roomState: {
            pin: room.pin,
            status: room.status,
            settings: room.settings,
            currentQuestion: activeQuestion,
            players: Object.values(room.players),
            leaderboard: gameManager.getLeaderboard(room.pin),
            hostPlayer,
            roundResults: room.lastRoundResults,
            gameOverData: room.lastGameOverData
          }
        });
      }
    });

    // --------------------------------------------------
    // Player: Join Room
    // --------------------------------------------------
    socket.on('join_room', (payload: JoinRoomPayload, callback) => {
      const result = gameManager.joinPlayer(
        payload.pin,
        socket.id,
        payload.nickname,
        payload.avatar || 'brain',
        payload.existingPlayerId,
        payload.sessionToken
      );

      if ('error' in result) {
        if (typeof callback === 'function') {
          callback({ success: false, error: result.error });
        }
        return;
      }

      const { player, isReconnection } = result;
      const room = gameManager.getRoom(payload.pin)!;
      socket.join(payload.pin);

      // Broadcast to room
      if (isReconnection) {
        io.to(payload.pin).emit('player_reconnected', {
          playerId: player.id,
          nickname: player.nickname,
          playersList: Object.values(room.players)
        });
      } else {
        io.to(payload.pin).emit('player_joined', {
          player,
          totalPlayers: Object.keys(room.players).length,
          playersList: Object.values(room.players)
        });
      }

      if (typeof callback === 'function') {
        callback({
          success: true,
          player,
          status: room.status,
          roomSettings: room.settings
        });
      }
    });

    // --------------------------------------------------
    // Player: Reconnect
    // --------------------------------------------------
    socket.on('reconnect_player', (payload: ReconnectPlayerPayload, callback) => {
      const result = gameManager.reconnectPlayer(
        payload.pin,
        payload.playerId,
        payload.sessionToken,
        socket.id
      );

      if ('error' in result) {
        if (typeof callback === 'function') {
          callback({ success: false, error: result.error });
        }
        return;
      }

      const { player, roomState } = result;
      socket.join(payload.pin);

      io.to(payload.pin).emit('player_reconnected', {
        playerId: player.id,
        nickname: player.nickname,
        playersList: Object.values(roomState.players)
      });

      let currentQuestion: ClientQuestion | null = null;
      let remainingSec = 0;

      if (roomState.status === 'QUESTION_ACTIVE' && roomState.roundStartedAt) {
        const q = roomState.questions[roomState.currentQuestionIndex];
        currentQuestion = {
          id: q.id,
          questionNumber: roomState.currentQuestionIndex + 1,
          totalQuestions: roomState.questions.length,
          expression: q.expression,
          timeLimitSec: q.timeLimitSec,
          serverStartedAt: roomState.roundStartedAt,
          operationType: q.operationType,
          options: q.options
        };
        const elapsed = (Date.now() - roomState.roundStartedAt) / 1000;
        remainingSec = Math.max(0, q.timeLimitSec - elapsed);
      }

      if (typeof callback === 'function') {
        callback({
          success: true,
          player,
          roomState: {
            status: roomState.status,
            currentQuestion,
            remainingSec,
            hasAnswered: player.hasAnsweredCurrentRound,
            settings: roomState.settings,
            score: player.score,
            streak: player.streak,
            roundResults: roomState.lastRoundResults,
            gameOverData: roomState.lastGameOverData
          }
        });
      }
    });

    // --------------------------------------------------
    // Host: Start Game
    // --------------------------------------------------
    socket.on('start_game', (payload: StartGamePayload) => {
      gameManager.startGame(payload.pin);
    });

    // --------------------------------------------------
    // Player: Submit Answer
    // --------------------------------------------------
    socket.on('submit_answer', (payload: SubmitAnswerPayload, callback) => {
      const result = gameManager.submitAnswer(
        payload.pin,
        payload.playerId,
        payload.questionId,
        payload.answer
      );

      if (typeof callback === 'function') {
        callback(result);
      }
    });

    // --------------------------------------------------
    // Host: Next Question
    // --------------------------------------------------
    socket.on('next_question', (payload: NextQuestionPayload) => {
      gameManager.nextQuestion(payload.pin);
    });

    // --------------------------------------------------
    // Host: Kick Player
    // --------------------------------------------------
    socket.on('kick_player', (payload: KickPlayerPayload) => {
      gameManager.leavePlayer(payload.pin, payload.playerId);
    });

    // --------------------------------------------------
    // Player: Leave Room
    // --------------------------------------------------
    socket.on('leave_room', (payload: { pin: string; playerId: string }) => {
      gameManager.leavePlayer(payload.pin, payload.playerId);
      socket.leave(payload.pin);
    });

    // --------------------------------------------------
    // Host: Reset Room to Play Again
    // --------------------------------------------------
    socket.on('reset_room', (payload: { pin: string }, callback) => {
      const result = gameManager.resetRoom(payload.pin);
      if (typeof callback === 'function') {
        callback(result);
      }
    });

    // --------------------------------------------------
    // Host: Close / Delete Room
    // --------------------------------------------------
    socket.on('close_room', (payload: { pin: string }, callback) => {
      const result = gameManager.closeRoom(payload.pin, 'El anfitrión ha cerrado la sala.');
      if (typeof callback === 'function') {
        callback(result);
      }
    });

    // --------------------------------------------------
    // Disconnect Handler
    // --------------------------------------------------
    socket.on('disconnect', () => {
      gameManager.handleDisconnect(socket.id);
    });
  });
}
