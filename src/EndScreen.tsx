import { EventHandler, useEffect, useState } from "react";
import GameOverBanner from "./GameOverBanner";
import QRCode from "react-qr-code";
import { signGameData } from "./utils";

type EndScreenProps = {
  totalBitcoin: number;
  reset: () => void;
  createdAt: number;
};

function EndScreen({ totalBitcoin, reset, createdAt }: EndScreenProps) {
  const [qrValue, setQrValue] = useState("");
  const [timesPressed, setTimesPressed] = useState(0);
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
      const signedGameData = await signGameData({
        createdAt,
        score: totalBitcoin,
      });
      setQrValue(
        `${import.meta.env.VITE_LEADERBOARD_URL}/new?data=${encodeURIComponent(JSON.stringify(signedGameData))}`,
      );
    }
    setupQr();
  }, []);
  if (!qrValue) {
    return <p>Loading...</p>;
  }
  return (
    <div className="flex h-full flex-col justify-around items-center">
      <h2 className="text-[10vh]">GAME OVER!</h2>
      <div className="flex gap-8 items-center">
        <div className="flex flex-col gap-2">
          <p className="text-2xl">
            YOU HAVE EARNED {(totalBitcoin / 100000000).toFixed(3)} BTC!
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
