import React, { useEffect, useState } from "react";
import {
  getColor,
  getRandomFee,
  getRandomWeight,
  getShuffledArray,
  getSize,
} from "./utils";

type BlockBuilderProps = {
  value: any;
  setValue: any;
  setPhase: any;
};

function BlockBuilder({ value, setValue, setPhase }: BlockBuilderProps) {
  const [weight, setWeight] = useState(0);
  const [waitingTransactions, setWaitingTransactions] = useState<
    WaitingTransaction[]
  >([]);
  const [isScanning, setIsScanning] = useState(false);

  function rollNewTransactions() {
    const tx: WaitingTransaction[] = [];
    const randomArray = getShuffledArray();
    for (let i = 0; i < 10; i++) {
      const rate = getRandomFee();
      tx.push({
        key: String(randomArray[i]),
        weight: getRandomWeight(rate),
        feeRate: rate,
      });
    }
    setWaitingTransactions(tx);
  }

  type WaitingTransaction = {
    key: string;
    weight: number;
    feeRate: number;
  };

  useEffect(() => {
    const activeKeys: string[] = [];
    const keyMap: { [key: string]: WaitingTransaction } = {};
    for (let i = 0; i < waitingTransactions.length; i++) {
      activeKeys.push(waitingTransactions[i].key);
      keyMap[waitingTransactions[i].key] = waitingTransactions[i];
    }
    function pressHandler(e: KeyboardEvent) {
      if (activeKeys.includes(e.key)) {
        const selected = waitingTransactions.find((tx) => tx.key === e.key);
        if (!selected) {
          return;
        }
        if (weight + selected?.weight > 100) {
          return;
        }
        setWaitingTransactions((p) => p.filter((tx) => tx.key !== e.key));
        setWeight((p) => p + selected!.weight);
        setValue((p) => p + selected!.weight * selected!.feeRate * 10000);
      }
    }
    function endHandler(e: KeyboardEvent) {
      if (e.code === "Enter") {
        setPhase("mining");
      }
    }
    if (waitingTransactions.length > 0) {
      window.addEventListener("keydown", pressHandler);
    }
    window.addEventListener("keydown", endHandler);
    return () => {
      console.log("Removed event handler");
      window.removeEventListener("keydown", pressHandler);
      window.removeEventListener("keydown", endHandler);
    };
  }, [waitingTransactions]);

  useEffect(() => {
    function startHandler(e: KeyboardEvent) {
      if (e.code === "Space") {
        setIsScanning(true);
        rollNewTransactions();
        setTimeout(() => {
          setIsScanning(false);
        }, 2000);
      }
    }

    if (!isScanning) {
      window.addEventListener("keydown", startHandler);
    }
    return () => {
      window.removeEventListener("keydown", startHandler);
    };
  }, [isScanning]);

  if (isScanning) {
    return <p className="text-2xl text-center">Scanning mempool...</p>;
  }

  if (waitingTransactions.length === 0) {
    return (
      <p className="animate-pulse text-2xl text-center">
        HIT SPACEBAR TO SCAN MEMPOOL
      </p>
    );
  }
  return (
    <div className="h-full w-full flex gap-4 items-center justify-center">
      <div className="flex flex-1 grow flex-col items-center p-4 gap-8 text-center [font-size:10px]">
        <div>
          <p>Blocktemplate Weight: {weight}</p>
          <div className="h-8 w-full flex bg-zinc-800">
            <div
              style={{ width: `${weight}%` }}
              className={`h-8 bg-pink-600`}
            />
          </div>
        </div>
        <p>Blocktemplate Value: {(value / 100000000).toFixed(2)} Bitcoin</p>
        <p>
          Average FeeRate:{" "}
          {waitingTransactions.reduce((a, c) => a + c.feeRate, 0) /
            waitingTransactions.length}{" "}
        </p>
      </div>
      <div className="grid h-[95%] aspect-square grid-cols-3 gap-2 bg-zinc-800 p-8">
        {waitingTransactions.map((tx) => {
          if (weight + tx.weight > 100) {
            return (
              <div className="flex justify-center items-center">
                <div
                  key={tx.key}
                  className={`${getSize(tx.weight)} bg-zinc-500 flex justify-center items-center`}
                >
                  <p className="font-bold text-xl">{tx.key.toUpperCase()}</p>
                </div>
              </div>
            );
          }
          return (
            <div className="flex justify-center items-center">
              <div
                key={tx.key}
                className={`${getSize(tx.weight)} ${getColor(tx.feeRate)} flex justify-center items-center`}
              >
                <p className="font-bold text-xl">{tx.key.toUpperCase()}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-1 grow h-full gap-2 justify-center items-center p-4 [font-size:10px]">
        <div className="flex h-[50%] w-full gap-2 justify-center">
          <div className="w-1/5 bg-gradient-to-b from-rose-600 to-sky-600"></div>
          <div className="flex flex-col justify-between items-end">
            <p>Low</p>
            <p>High </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlockBuilder;
