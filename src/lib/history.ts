// history.ts
export type MatchHistory = {
  roomId: string;
  players: string[];
  winner: string;
  date: Date;
};

export const matchHistory: MatchHistory[] = [];

export function saveMatch(data: MatchHistory) {
  matchHistory.push(data);
}
