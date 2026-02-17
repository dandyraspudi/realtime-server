export type Player = {
  id: string;
  name: string;
  hp: number;
};

export type Room = {
  id: string;
  players: Player[];
  turn: string;
  battleLog: string[];
  winner: string | null;
  timer?: NodeJS.Timeout;
  spectators?: string[];
};

