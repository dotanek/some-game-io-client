export enum SocketEvent {

  // Received
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  GAME_UPDATE = 'game-update',
  ERROR = 'error',

  // Emitted
  GAME_JOIN = 'game-join',
  PLAYER_UPDATE = 'player-update',
}