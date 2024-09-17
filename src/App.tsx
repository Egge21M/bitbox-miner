import { useEffect, useState } from "react";
import EndScreen from "./EndScreen";
import StartImage from "./StartImage";
import Tetris from "./Tetris";
import Instructions from "./Instructions";

function App() {
  const [minedValue, setMinedValue] = useState(0);
  const [phase, setPhase] = useState<"start" | "building" | "mining" | "end">(
    "start",
  );

  function endGame() {
    setPhase("end");
  }

  function reset() {
    setMinedValue(0);
    setPhase("start");
  }

  useEffect(() => {
    function startHandler(e: CustomEvent) {
      if (e.detail === "start") {
        setPhase("building");
      }
    }
    if (phase === "start") {
      window.addEventListener("gamepad-pressed", startHandler as EventListener);
    }
    return () => {
      window.removeEventListener(
        "gamepad-pressed",
        startHandler as EventListener,
      );
    };
  }, [phase]);
  if (phase === "end") {
    return <EndScreen totalBitcoin={minedValue} reset={reset} />;
  }
  if (phase === "start") {
    return (
      <div className="w-full h-full flex flex-col justify-around items-center p-4">
        <StartImage />
        <Instructions />
        <p className="text-xl animate-pulse">PRESS ENTER TO PLAY!</p>
      </div>
    );
  }
  return (
    <Tetris
      setMinedValue={setMinedValue}
      minedValue={minedValue}
      endGame={endGame}
    />
  );
}

export default App;
