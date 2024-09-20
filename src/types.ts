export type LeaderboardEntry = {
  name: string;
  score: number;
};

export type SignedGameData = {
  createdAt: number;
  score: number;
  signature: string;
};

export type UnsignedGameData = {
  createdAt: number;
  score: number;
};
