import { useEffect, useState } from "react";
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
      <GameOverBanner />
      <div className="flex gap-8 items-center">
        <div>
          <p>YOU HAVE EARNED {(totalBitcoin / 100000000).toFixed(3)} BTC!</p>
          <p>Scan this QR code to sumbit your score!</p>
        </div>
        <div className="bg-zinc-50 p-4 rounded">
          <QRCode value={qrValue} />
        </div>
      </div>
    </div>
  );
}

export default EndScreen;
