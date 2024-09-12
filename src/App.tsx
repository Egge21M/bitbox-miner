import { useEffect, useState } from "react";
import EndScreen from "./EndScreen";
import StartImage from "./StartImage";
import Tetris from "./Tetris";

function App() {
  const [minedValue, setMinedValue] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<"start" | "building" | "mining" | "end">(
    "start",
  );

  function reset() {
    setMinedValue(0);
    setPhase("start");
  }

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    function startHandler(e: KeyboardEvent) {
      if (e.code === "Enter") {
        setPhase("building");
        setIsRunning(true);
      }
    }
    if (phase === "start") {
      window.addEventListener("keydown", startHandler);
    }
    return () => {
      window.removeEventListener("keydown", startHandler);
    };
  }, [phase]);
  if (phase === "end") {
    return <EndScreen totalBitcoin={minedValue} reset={reset} />;
  }
  if (phase === "start") {
    return (
      <div className="w-full h-full flex flex-col justify-around items-center">
        <StartImage />
        <p className="text-2xl animate-pulse">PRESS ENTER TO PLAY!</p>
      </div>
    );
  }
  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="h-full w-full flex flex-col overflow-hidden ">
        <Tetris />
      </div>
    </div>
  );
}

export default App;
