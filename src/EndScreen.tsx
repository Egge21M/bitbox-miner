import React, { useEffect, useMemo, useRef, useState } from "react";
import GameOverBanner from "./GameOverBanner";
import { useLeaderboard } from "./hooks/useLeaderboard";
import { getPlacement } from "./utils";

function EndScreen({ totalBitcoin, reset }) {
  const [showLeaderboard, setShowLeaderBoard] = useState(false);
  const { leaderboard, setLeaderboard } = useLeaderboard();
  const placement = useMemo(() => {
    return getPlacement(totalBitcoin, leaderboard);
  }, []);
  console.log("placement: ", placement);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function enterHandler(e: KeyboardEvent) {
      if (e.code === "Enter") {
        reset();
      }
    }
    if (showLeaderboard) {
      window.addEventListener("keydown", enterHandler);
    }
    return () => {
      window.removeEventListener("keydown", enterHandler);
    };
  }, [showLeaderboard]);

  function submitHander() {
    console.log(inputRef.current?.value);
    if (inputRef.current && inputRef.current.value) {
      setLeaderboard([
        ...leaderboard,
        { name: inputRef.current.value, score: totalBitcoin },
      ]);
    }
    setShowLeaderBoard(true);
  }
  if (showLeaderboard) {
    return (
      <div className="flex h-full w-full flex-col justify-around items-center">
        <h1 className="text-3xl mt-6">Leaderboard</h1>
        <ol className="w-full flex flex-col items-center justify-center">
          {leaderboard
            .sort((a, b) => b.score - a.score)
            .slice(0, 10)
            .map((e, i) => (
              <li
                className={`w-2/3 flex justify-between ${placement === i + 1 ? "text-orange-500" : ""} gap-2`}
              >
                <div className="flex gap-2">
                  <p>{i + 1}.</p>
                  <p>{(e.score / 100000000).toFixed(3)} BTC</p>
                </div>
                <p>{e.name}</p>
              </li>
            ))}
        </ol>
        <p className="text-2xl animate-pulse">Press ENTER to continue...</p>
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col justify-around items-center">
      <GameOverBanner />
      <p>YOU HAVE EARNED {(totalBitcoin / 100000000).toFixed(3)} BTC!</p>
      <div className="flex flex-col items-center gap-4">
        {placement ? (
          <p>AND PLACED {placement}. ON THE LEADERBOARD!</p>
        ) : (
          <p>AND DID NOT PLACE ON THE LEADERBOARD...</p>
        )}
        <input
          className="p-4 rounded focus:outline-none"
          type="text"
          placeholder="Your Name..."
          autoFocus
          onSubmit={() => {
            console.log("Submitted!!");
          }}
          ref={inputRef}
        />
        <button onClick={submitHander}>Submit</button>
      </div>
    </div>
  );
}

export default EndScreen;
