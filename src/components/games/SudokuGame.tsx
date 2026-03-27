import React, { useMemo, useState } from "react";

type SudokuGameProps = {
  onSolved: () => void;
};

const STARTING_BOARD: number[][] = [
  [0, 0, 0, 2, 6, 0, 7, 0, 1],
  [6, 8, 0, 0, 7, 0, 0, 9, 0],
  [1, 9, 0, 0, 0, 4, 5, 0, 0],

  [8, 2, 0, 1, 0, 0, 0, 4, 0],
  [0, 0, 4, 6, 0, 2, 9, 0, 0],
  [0, 5, 0, 0, 0, 3, 0, 2, 8],

  [0, 0, 9, 3, 0, 0, 0, 7, 4],
  [0, 4, 0, 0, 5, 0, 0, 3, 6],
  [7, 0, 3, 0, 1, 8, 0, 0, 0],
];

const SOLUTION: number[][] = [
  [4, 3, 5, 2, 6, 9, 7, 8, 1],
  [6, 8, 2, 5, 7, 1, 4, 9, 3],
  [1, 9, 7, 8, 3, 4, 5, 6, 2],

  [8, 2, 6, 1, 9, 5, 3, 4, 7],
  [3, 7, 4, 6, 8, 2, 9, 1, 5],
  [9, 5, 1, 7, 4, 3, 6, 2, 8],

  [5, 1, 9, 3, 2, 6, 8, 7, 4],
  [2, 4, 8, 9, 5, 7, 1, 3, 6],
  [7, 6, 3, 4, 1, 8, 2, 5, 9],
];

function cloneBoard(board: number[][]): number[][] {
  return board.map((row) => [...row]);
}

function countNumber(board: number[][], target: number): number {
  return board.flat().filter((value) => value === target).length;
}

export default function SudokuGame({
  onSolved,
}: SudokuGameProps): React.JSX.Element {
  const [board, setBoard] = useState<number[][]>(() =>
    cloneBoard(STARTING_BOARD)
  );
  const [message, setMessage] = useState<string>("");
  const [highlightedNumber, setHighlightedNumber] = useState<number | null>(
    null
  );

  const fixedCells = useMemo<boolean[][]>(
    () => STARTING_BOARD.map((row) => row.map((value) => value !== 0)),
    []
  );

  function handleChange(row: number, col: number, value: string): void {
    if (fixedCells[row][col]) return;

    if (!/^[1-9]?$/.test(value)) return;

    const nextBoard = cloneBoard(board);
    nextBoard[row][col] = value === "" ? 0 : Number(value);
    setBoard(nextBoard);
    setMessage("");
  }

  function checkAnswer(): void {
    const isCorrect = board.every((row, rowIndex) =>
      row.every((cell, colIndex) => cell === SOLUTION[rowIndex][colIndex])
    );

    if (isCorrect) {
      setMessage("Alt er riktig! Sudokuen er løst.");
      onSolved();
      return;
    }

    setMessage("Ikke alle tallene er riktige ennå.");
  }

  function handleHighlightNumber(num: number): void {
    setHighlightedNumber(num);

    window.setTimeout(() => {
      setHighlightedNumber((current) => (current === num ? null : current));
    }, 1500);
  }

  const completedNumbers = useMemo(() => {
    const map: Record<number, boolean> = {};
    for (let num = 1; num <= 9; num += 1) {
      map[num] = countNumber(board, num) === 9;
    }
    return map;
  }, [board]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-stone-700">
        Fyll inn Sudokuen. De grønne tallene er låst. Når du tror du er ferdig,
        trykk <span className="font-semibold">Sjekk svar</span>.
      </p>

      <div className="mx-auto w-fit rounded-xl border border-stone-500 bg-stone-200 p-2">
        <div className="grid grid-cols-9">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isFixed = fixedCells[rowIndex][colIndex];
              const thickRight = (colIndex + 1) % 3 === 0 && colIndex !== 8;
              const thickBottom = (rowIndex + 1) % 3 === 0 && rowIndex !== 8;
              const isHighlighted =
                highlightedNumber !== null && cell === highlightedNumber;

              return (
                <input
                  key={`${rowIndex}-${colIndex}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[1-9]*"
                  maxLength={1}
                  value={cell === 0 ? "" : cell}
                  onChange={(e) =>
                    handleChange(rowIndex, colIndex, e.target.value)
                  }
                  readOnly={isFixed}
                  className={[
                    "h-9 w-9 border border-stone-400 text-center text-base outline-none transition sm:h-10 sm:w-10 sm:text-lg md:h-11 md:w-11",
                    isFixed
                      ? "bg-green-100 font-semibold text-green-800"
                      : "bg-white text-stone-900",
                    isHighlighted ? "bg-yellow-200" : "",
                    thickRight ? "border-r-4 border-r-stone-700" : "",
                    thickBottom ? "border-b-4 border-b-stone-700" : "",
                  ].join(" ")}
                />
              );
            })
          )}
        </div>
      </div>

      <div className="flex w-full justify-between px-2">
        {Array.from({ length: 9 }, (_, index) => index + 1).map((num) => {
          const isComplete = completedNumbers[num];

          return (
            <button
              key={num}
              type="button"
              onClick={() => handleHighlightNumber(num)}
              disabled={isComplete}
              className={[
                "flex h-8 w-8 items-center justify-center rounded border text-sm font-semibold transition sm:text-base",
                isComplete
                  ? "cursor-not-allowed border-stone-300 bg-stone-300 text-stone-500"
                  : "border-stone-700 bg-white text-stone-900 hover:scale-105 hover:bg-stone-100",
              ].join(" ")}
            >
              {num}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={checkAnswer}
          className="rounded-lg bg-stone-900 px-4 py-2 text-white transition hover:bg-black"
        >
          Sjekk svar
        </button>

        {message && <p className="text-sm text-stone-700">{message}</p>}
      </div>
    </div>
  );
}
