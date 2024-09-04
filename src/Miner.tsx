import { useEffect, useState } from "react";
import { randomHexStrings } from "./main";

const max = 500;

type MinerProps = {
  submitBlock: () => void;
};

function Miner({ submitBlock }: MinerProps) {
  const [presses, setPresses] = useState(0);
  const [hashes, setHashes] = useState<string[]>([]);
  const progress = (Math.fround(presses / max) * 100).toFixed();

  useEffect(() => {
    function handlePress() {
      setPresses((p) => p + 1);
    }
    window.addEventListener("keydown", handlePress);
    return () => {
      window.removeEventListener("keydown", handlePress);
    };
  }, []);

  useEffect(() => {
    setHashes((p) => [...p, randomHexStrings[parseInt(progress)]]);
  }, [progress]);

  if (Number(progress) >= 100) {
    submitBlock();
  }
  return (
    <div className="grow flex flex-col gap-8 items-center justify-between">
      <div className="w-full grow flex flex-col justify-around">
        <p className="text-2xl animate-pulse">MASH KEYBOARD TO MINE!</p>
        <div className="h-20 w-full relative bg-zinc-600">
          <div
            style={{ width: `${progress}%` }}
            className={`relative h-full bg-emerald-600`}
          ></div>
          <div className="absolute h-full z-10 inset-0 flex justify-center items-center">
            <p className="text-1xl font-bold">{progress}%</p>
          </div>
        </div>
      </div>
      <div className="h-72 overflow-hidden text-xs ">
        {hashes
          .slice()
          .reverse()
          .map((h) => (
            <p>{h.slice(0, 64)}</p>
          ))}
      </div>
    </div>
  );
}

export default Miner;
