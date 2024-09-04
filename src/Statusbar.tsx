type StatusBarProps = {
  timeLeft: number;
  coinsCollected: number;
};

function StatusBar({ timeLeft, coinsCollected }: StatusBarProps) {
  return (
    <div className="w-full flex items-center justify-around h-12 bg-zinc-200 text-zinc-800">
      <p>BitBox Miner</p>
      <div>
        <p className="text-xs">Time: {timeLeft}</p>
        <p className="text-xs">
          Mining Reward: {(coinsCollected / 100000000).toFixed(4)} BTC
        </p>
      </div>
    </div>
  );
}

export default StatusBar;
