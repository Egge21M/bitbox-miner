import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { signGameData } from "./utils";
import { feeRate, weigthPerBlock } from "./constants";

type EndScreenProps = {
  totalBitcoin: number;
  reset: () => void;
  createdAt: number;
  boni: boolean[];
};

function EndScreen({ totalBitcoin, reset, createdAt, boni }: EndScreenProps) {
  const [qrValue, setQrValue] = useState("");
  const [timesPressed, setTimesPressed] = useState(0);
  const bonusScore =
    boni.filter((b) => b).length * (100 * weigthPerBlock * feeRate);
  console.log(bonusScore);
  console.log(totalBitcoin);
  const score = totalBitcoin + bonusScore;
  useEffect(() => {
    function handleStartPressed(e: CustomEvent) {
      if (e.detail === "start") {
        if (timesPressed === 2) {
          reset();
        } else {
          setTimesPressed((p) => p + 1);
        }
      }
    }
    window.addEventListener(
      "gamepad-pressed",
      handleStartPressed as EventListener,
    );
    return () => {
      window.removeEventListener(
        "gamepad-pressed",
        handleStartPressed as EventListener,
      );
    };
  }, [timesPressed]);
  useEffect(() => {
    async function setupQr() {
      console.log("Generating QR");
      const signedGameData = await signGameData({
        createdAt,
        score,
      });
      setQrValue(
        `${import.meta.env.VITE_LEADERBOARD_URL}/new?data=${encodeURIComponent(JSON.stringify(signedGameData))}`,
      );
    }
    setupQr();
  }, [score]);
  if (!qrValue) {
    return <p>Loading...</p>;
  }
  return (
    <div className="flex h-full flex-col justify-around items-center">
      <h2 className="text-[10vh]">GAME OVER!</h2>
      <div className="flex gap-8 items-center">
        <div className="flex flex-col gap-2">
          <p className="text-2xl">
            YOU HAVE EARNED {(score / 100000000).toFixed(4)} BTC!
          </p>
          <p>Scan this QR code to sumbit your score!</p>
        </div>
        <div className="bg-zinc-50 p-4 rounded">
          <QRCode value={qrValue} />
        </div>
      </div>
      <p className="animate-pulse">
        Press START {3 - timesPressed} times to restart
      </p>
    </div>
  );
}

export default EndScreen;
