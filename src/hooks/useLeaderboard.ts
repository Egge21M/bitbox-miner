import { useCallback, useState } from "react";
import { LeaderboardEntry } from "../types";

export function useLeaderboard() {
  const [leaderboard, _setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    if (typeof window !== "undefined") {
      const savedBoard = localStorage.getItem("leaderboard");
      return savedBoard ? JSON.parse(savedBoard) : [];
    }
    return [];
  });

  const setLeaderboard = useCallback((newLeaderboard: LeaderboardEntry[]) => {
    localStorage.setItem("leaderboard", JSON.stringify(newLeaderboard));
    _setLeaderboard(newLeaderboard);
  }, []);
  return { leaderboard, setLeaderboard };
}
