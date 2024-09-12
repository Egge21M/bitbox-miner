import { useCallback, useEffect, useRef, useState } from "react";

type ShapeMatrix = number[][];
type Shape = { number: number; shape: ShapeMatrix };

const rows = 20;
const columns = 10;
const newgrid = Array(20).fill(Array(10).fill(0));

const I_SHAPE = [[1, 1, 1, 1]];

const O_SHAPE = [
  [1, 1],
  [1, 1],
];

const T_SHAPE = [
  [0, 1, 0],
  [1, 1, 1],
];

const S_SHAPE = [
  [0, 1, 1],
  [1, 1, 0],
];

const Z_SHAPE = [
  [1, 1, 0],
  [0, 1, 1],
];

const J_SHAPE = [
  [1, 0, 0],
  [1, 1, 1],
];

const L_SHAPE = [
  [0, 0, 1],
  [1, 1, 1],
];

const shapes = [
  { number: 8, shape: I_SHAPE },
  { number: 2, shape: O_SHAPE },
  { number: 3, shape: T_SHAPE },
  { number: 4, shape: S_SHAPE },
  { number: 5, shape: Z_SHAPE },
  { number: 6, shape: J_SHAPE },
  { number: 7, shape: L_SHAPE },
];

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

function Tetris() {
  const [board, setBoard] = useState(newgrid);
  const [shape, setShape] = useState(shapes[0]);
  const [cursorX, setCursorX] = useState(4);
  const [cursorY, setCursorY] = useState(0);
  const combinedBoard = [...board.map((row) => [...row])];

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

    shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
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
        alert("Game ended");
      }
    });

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
      setShape(shapes[Math.round(Math.random() * (shapes.length - 1))]);
    }
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const code = e.code;
      switch (code) {
        case "ArrowLeft":
          setCursorX((p) => {
            const check = checkMove(shape, p - 1, cursorY);
            if (check === "valid") {
              return p - 1;
            } else {
              return p;
            }
          });
          break;

        case "ArrowRight":
          setCursorX((p) => {
            const check = checkMove(shape, p + 1, cursorY);
            if (check === "valid") {
              return p + 1;
            } else {
              return p;
            }
          });
          break;
        case "ArrowUp": {
          const rotatedShape = rotateClockwise(shapeRef.current.shape);
          const currentShape = { ...shapeRef.current, shape: rotatedShape };

          if (
            checkMove(currentShape, cursorXRef.current, cursorYRef.current) ===
            "valid"
          ) {
            setShape(currentShape);
          }
          break;
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [cursorY, shape, checkMove]);

  useEffect(() => {
    const interval = setInterval(() => {
      moveShapeDown();
    }, 300);

    return () => clearInterval(interval);
  }, []);

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
    <div className="flex flex-col gap-1 h-1/2 w-1/2">
      {Array(rows)
        .fill(0)
        .map((_, i) => {
          return (
            <div className="flex gap-2">
              {Array(columns)
                .fill(0)
                .map((_, j) => {
                  if (combinedBoard[i][j] === 2) {
                    return <div className="bg-purple-500 h-4 w-4"></div>;
                  }
                  if (combinedBoard[i][j] === 3) {
                    return <div className="bg-green-500 h-4 w-4"></div>;
                  }
                  if (combinedBoard[i][j] === 4) {
                    return <div className="bg-sky-500 h-4 w-4"></div>;
                  }
                  if (combinedBoard[i][j] === 5) {
                    return <div className="bg-yellow-500 h-4 w-4"></div>;
                  }
                  if (combinedBoard[i][j] === 6) {
                    return <div className="bg-red-500 h-4 w-4"></div>;
                  }
                  if (combinedBoard[i][j] === 7) {
                    return <div className="bg-pink-500 h-4 w-4"></div>;
                  }
                  if (combinedBoard[i][j] === 8) {
                    return <div className="bg-orange-500 h-4 w-4"></div>;
                  }

                  if (combinedBoard[i][j] === 1) {
                    return <div className="bg-red-200 h-4 w-4"></div>;
                  }
                  return <div className="bg-red-50 h-4 w-4"></div>;
                })}
            </div>
          );
        })}
    </div>
  );
}

export default Tetris;
