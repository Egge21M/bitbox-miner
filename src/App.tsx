import { useEffect, useState } from "react";
import Miner from "./Miner";
import StatusBar from "./Statusbar";
import EndScreen from "./EndScreen";
import StartImage from "./StartImage";
import Tetris from "./Tetris";

const initialTime = 60;

let time = initialTime;

function App() {
  const [pendingValue, setPendingValue] = useState(0);
  const [minedValue, setMinedValue] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<"start" | "building" | "mining" | "end">(
    "start",
  );
  const [secondsLeft, setSecondsLeft] = useState(time);

  function reset() {
    time = initialTime;
    setSecondsLeft(5);
    setMinedValue(0);
    setPhase("start");
  }

  function submitBlock() {
    setMinedValue((p) => p + pendingValue + 312500000);
    setPendingValue(0);
    setPhase("building");
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
      <StatusBar timeLeft={secondsLeft} coinsCollected={minedValue} />
      <div className="grow w-full flex flex-col justify-center items-center">
        {(() => {
          if (phase === "mining") {
            return <Miner submitBlock={submitBlock} />;
          }
          return (
            // <BlockBuilder
            //   value={pendingValue}
            //   setValue={setPendingValue}
            //   setPhase={setPhase}
            // />
            <Tetris />
          );
        })()}
      </div>
    </div>
  );
}

export default App;
