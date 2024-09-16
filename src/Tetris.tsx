import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { feeRate, newgrid, shapes, weigthPerBlock } from "./constants";
import { FaStar } from "react-icons/fa";

type ShapeMatrix = number[][];
type Shape = { number: number; shape: ShapeMatrix };

const rotateClockwise = (shape: ShapeMatrix) => {
  const rows = shape.length;
  const columns = shape[0].length;

  const rotatedShape = Array(columns)
    .fill(null)
    .map(() => Array(rows).fill(0));

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      rotatedShape[x][rows - 1 - y] = shape[y][x];
    }
  }

  return rotatedShape;
};

const rotateCounterClockwise = (shape: ShapeMatrix) => {
  const rows = shape.length;
  const columns = shape[0].length;

  const rotatedShape = Array(columns)
    .fill(null)
    .map(() => Array(rows).fill(0));

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      rotatedShape[columns - 1 - x][y] = shape[y][x];
    }
  }

  return rotatedShape;
};

type TetrisProps = {
  minedValue: number;
  setMinedValue: Dispatch<SetStateAction<number>>;
  endGame: () => void;
};

function Tetris({ minedValue, setMinedValue, endGame }: TetrisProps) {
  const [board, setBoard] = useState(newgrid);
  const [shape, setShape] = useState(
    () => shapes[Math.floor(Math.random() * shapes.length - 1)],
  );
  const [cursorX, setCursorX] = useState(4);
  const [cursorY, setCursorY] = useState(0);
  const [round, setRound] = useState(1);
  const combinedBoard = [...board.map((row) => [...row])];
  const [weight, setWeight] = useState(0);
  const [boni, setBoni] = useState([false, false, false]);

  useEffect(() => {
    const blockSize = 10;
    const totalBlocks = Math.floor(board.length / blockSize);

    const result = [];

    for (let blockIndex = 0; blockIndex < totalBlocks; blockIndex++) {
      const block = board.slice(
        blockIndex * blockSize,
        (blockIndex + 1) * blockSize,
      );
      const isBlockFull = block.every((row) =>
        row.every((cell: number) => cell !== 0),
      );
      result.push(isBlockFull);
    }
    setBoni(result.reverse());
  }, [board]);

  const cursorXRef = useRef(cursorX);
  const cursorYRef = useRef(cursorY);
  const shapeRef = useRef(shape);
  const boardRef = useRef(board);

  useEffect(() => {
    cursorXRef.current = cursorX;
    cursorYRef.current = cursorY;
    shapeRef.current = shape;
    boardRef.current = board;
  }, [cursorX, cursorY, shape, board]);

  const checkMove = (shapeObj: Shape, cursorX: number, cursorY: number) => {
    const shape = shapeObj.shape;
    const shapeHeight = shape.length;
    const shapeWidth = shape[0].length;

    for (let y = 0; y < shapeHeight; y++) {
      for (let x = 0; x < shapeWidth; x++) {
        if (shape[y][x] !== 0) {
          const boardX = cursorX + x;
          const boardY = cursorY + y;

          if (
            boardX < 0 ||
            boardX >= board[0].length ||
            boardY >= board.length
          ) {
            return "out-of-bounds";
          }

          if (boardY >= 0 && boardRef.current[boardY][boardX] !== 0) {
            return "collision";
          }
        }
      }
    }

    return "valid";
  };

  const lockShapeOnBoard = (
    shapeObj: Shape,
    cursorX: number,
    cursorY: number,
  ) => {
    const shape = shapeObj.shape;
    const newBoard = boardRef.current.map((row) => row.slice());
    let points = 0;

    shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          points++;
          const boardX = cursorX + x;
          const boardY = cursorY + y;
          if (
            boardY >= 0 &&
            boardX >= 0 &&
            boardX < newBoard[0].length &&
            boardY < newBoard.length
          ) {
            newBoard[boardY][boardX] = shapeObj.number;
          }
        }
      });
    });
    newBoard[0].forEach((slot: number) => {
      if (slot) {
        endGame();
      }
    });
    const blockValue = points * weigthPerBlock * feeRate;
    setMinedValue((p) => p + blockValue);
    setWeight((p) => p + 2);

    setBoard(newBoard);
  };

  const moveShapeDown = useCallback(() => {
    const newCursorY = cursorYRef.current + 1;
    const result = checkMove(shapeRef.current, cursorXRef.current, newCursorY);

    if (result === "valid") {
      setCursorY(newCursorY);
    } else if (result === "collision" || result === "out-of-bounds") {
      lockShapeOnBoard(
        shapeRef.current,
        cursorXRef.current,
        cursorYRef.current,
      );
      setCursorY(0);
      setCursorX(4);
      setRound((p) => p + 1);
      setShape(shapes[Math.floor(Math.random() * (shapes.length - 1))]);
    }
  }, []);

  const handleMoveLeft = () => {
    setCursorX((p) => {
      const check = checkMove(shapeRef.current, p - 1, cursorYRef.current);
      if (check === "valid") {
        return p - 1;
      } else {
        return p;
      }
    });
  };

  const handleMoveRight = () => {
    setCursorX((p) => {
      const check = checkMove(shapeRef.current, p + 1, cursorYRef.current);
      if (check === "valid") {
        return p + 1;
      } else {
        return p;
      }
    });
  };

  const handleRotate = () => {
    const rotatedShape = rotateClockwise(shapeRef.current.shape);
    const currentShape = { ...shapeRef.current, shape: rotatedShape };

    const shapeWidth = rotatedShape[0].length;
    const boardWidth = boardRef.current[0].length;

    let adjustedCursorX = cursorXRef.current;

    if (adjustedCursorX + shapeWidth > boardWidth) {
      adjustedCursorX = boardWidth - shapeWidth;
    }

    if (adjustedCursorX < 0) {
      adjustedCursorX = 0;
    }

    if (
      checkMove(currentShape, adjustedCursorX, cursorYRef.current) === "valid"
    ) {
      setShape(currentShape);
      setCursorX(adjustedCursorX);
    }
  };

  const handleRotateCounter = () => {
    const rotatedShape = rotateCounterClockwise(shapeRef.current.shape);
    const currentShape = { ...shapeRef.current, shape: rotatedShape };

    const shapeWidth = rotatedShape[0].length;
    const boardWidth = boardRef.current[0].length;

    let adjustedCursorX = cursorXRef.current;

    if (adjustedCursorX + shapeWidth > boardWidth) {
      adjustedCursorX = boardWidth - shapeWidth;
    }

    if (adjustedCursorX < 0) {
      adjustedCursorX = 0;
    }

    if (
      checkMove(currentShape, adjustedCursorX, cursorYRef.current) === "valid"
    ) {
      setShape(currentShape);
      setCursorX(adjustedCursorX);
    }
  };

  useEffect(() => {
    function handleGamepadPressed(e: CustomEvent) {
      const code = e.detail;
      switch (code) {
        case "left":
          handleMoveLeft();
          break;
        case "right":
          handleMoveRight();
          break;
        case "b":
          handleRotateCounter();
          break;
        case "a":
          handleRotate();
          break;
        case "down":
          moveShapeDown();
          break;
      }
    }
    window.addEventListener(
      "gamepad-pressed",
      handleGamepadPressed as EventListener,
    );
    return () => {
      window.removeEventListener(
        "gamepad-pressed",
        handleGamepadPressed as EventListener,
      );
    };
  }, [moveShapeDown]);

  useEffect(() => {
    let time;
    if (round < 5) {
      time = 300;
    } else if (round < 10) {
      time = 250;
    } else {
      time = 200;
    }

    const interval = setInterval(() => {
      moveShapeDown();
    }, time);

    return () => clearInterval(interval);
  }, [round]);

  shape.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        const boardX = cursorX + x;
        const boardY = cursorY + y;
        if (
          boardY >= 0 &&
          boardX >= 0 &&
          boardX < combinedBoard[0].length &&
          boardY < combinedBoard.length
        ) {
          combinedBoard[boardY][boardX] = value;
        }
      }
    });
  });

  return (
    <div className="w-full h-full flex gap-2">
      <div className="flex flex-col items-center p-4 aspect-[3/7] ">
        <div className="h-[10%] w-[33%] bg-zinc-400 rounded-t"></div>
        <div className="flex w-full h-[90%] bg-zinc-900 rounded-xl p-4 pb-8 justify-center">
          <div className="grid grid-cols-10 grid-rows-30 gap-0.5 ">
            {Array(30)
              .fill(0)
              .map((_, rowIndex) =>
                Array(10)
                  .fill(0)
                  .map((_, colIndex) => {
                    let bgColor = "bg-zinc-800";
                    let border = "border-none border-zinc-50";
                    switch (combinedBoard[rowIndex][colIndex]) {
                      case 2:
                        bgColor = "bg-purple-500";
                        break;
                      case 3:
                        bgColor = "bg-green-500";
                        break;
                      case 4:
                        bgColor = "bg-sky-500";
                        break;
                      case 5:
                        bgColor = "bg-yellow-500";
                        break;
                      case 6:
                        bgColor = "bg-red-500";
                        break;
                      case 7:
                        bgColor = "bg-pink-500";
                        break;
                      case 8:
                        bgColor = "bg-orange-500";
                        break;
                      case 1:
                        bgColor = "bg-zinc-300";
                        break;
                    }
                    if (rowIndex === 9 || rowIndex === 19) {
                      border = "border-b-[1px] border-zinc-50";
                    }
                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`${bgColor} ${border} aspect-square`}
                      ></div>
                    );
                  }),
              )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 justify-center text-left text-sm">
        <p>Current Fee Rate: 16 sats / vByte</p>
        <p>Block Size: {(weight * 10000) / 1000000} vMB</p>
        <p>Block Value: {minedValue / 100000000} Bitcoin</p>
        <div>
          <p>SegWit Bonus (Full Blocks)</p>
          {boni.map((isActive) => (
            <FaStar fill={isActive ? "yellow" : "grey"} />
          ))}
        </div>
      </div>
    </div>
  );
}
export default Tetris;
