import { LeaderboardEntry } from "./types";

export const arr = ["w", "q", "e", "r", "t", "z", "u", "i", "o", "p"];
const rates = [84, 132, 150, 198, 240, 275, 375, 680];

export function getSize(weight: number) {
  if (weight < 5) {
    return "w-[20%] h-[20%] ";
  }
  if (weight >= 5 && weight < 15) {
    return "w-[35%] h-[35%]";
  }
  if (weight >= 15 && weight < 25) {
    return "w-[50%] h-[50%] ";
  }
  if (weight >= 25 && weight < 35) {
    return "w-[75%] h-[75%]";
  }
  if (weight >= 35) {
    return "w-[100%] h-[100%]";
  }
}

export function getColor(feeRate: number) {
  if (feeRate === 84) {
    return "bg-sky-600";
  }
  if (feeRate === 132) {
    return "bg-blue-600";
  }
  if (feeRate === 150) {
    return "bg-indigo-600";
  }
  if (feeRate === 198) {
    return "bg-violet-600";
  }
  if (feeRate === 240) {
    return "bg-purple-600";
  }
  if (feeRate === 275) {
    return "bg-fuchsia-600";
  }
  if (feeRate === 375) {
    return "bg-pink-600";
  }
  if (feeRate === 680) {
    return "bg-rose-600";
  }
}

export function getShuffledArray(): string[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function getRandomWeight(feeRate: number): number {
  let maxWeight = 40;
  if (feeRate > 300) {
    maxWeight = 20;
  }
  return Math.max(1, Math.round(Math.random() * maxWeight));
}

export function getRandomFee(): number {
  return rates[Math.floor(Math.random() * 8)];
}

export function sortLeaderboardDesc(
  leaderboard: LeaderboardEntry[],
): LeaderboardEntry[] {
  return leaderboard.sort((a, b) => b.score - a.score);
}

export function getPlacement(
  score: number,
  leaderboard: LeaderboardEntry[],
): number | undefined {
  if (leaderboard.length === 0) {
    return 1;
  }
  const sorted = sortLeaderboardDesc(leaderboard);
  for (let i = 0; i < sorted.length; i++) {
    if (score > sorted[i].score) {
      return i + 1;
    }
  }
  if (leaderboard.length < 10) {
    return leaderboard.length + 1;
  }
}
