import React, { useState } from "react";
import GameSuccessOverlay from "../GamesSuccessOverlay";

type NonogramGameProps = {
  onSolved: () => void;
};

type CellState = "empty" | "filled" | "crossed";

const ROW_CLUES: number[][] = [[2, 2], [2, 1], [1, 2], [1], [2]];
const COL_CLUES: number[][] = [[3], [2], [2], [1, 1, 1], [3]];

const SOLUTION: boolean[][] = [
  [true, true, false, true, true],
  [true, true, false, false, true],
  [true, false, false, true, true],
  [false, false, true, false, false],
  [false, false, true, true, false],
];

const GRID_SIZE = 5;
const CELL_SIZE = 56;
const CLUE_CELL_SIZE = 36;

function createEmptyBoard(): CellState[][] {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => "empty" as CellState)
  );
}

function nextCellState(state: CellState): CellState {
  if (state === "empty") return "filled";
  if (state === "filled") return "crossed";
  return "empty";
}

export default function NonogramGame({
  onSolved,
}: NonogramGameProps): React.JSX.Element {
  const [board, setBoard] = useState<CellState[][]>(createEmptyBoard);
  const [message, setMessage] = useState("");
  const [showVictory, setShowVictory] = useState(false);

  const maxRowClues = Math.max(...ROW_CLUES.map((row) => row.length));
  const maxColClues = Math.max(...COL_CLUES.map((col) => col.length));

  function handleCellClick(row: number, col: number): void {
    if (showVictory) return;

    setBoard((prev) => {
      const next = prev.map((r) => [...r]);
      next[row][col] = nextCellState(next[row][col]);
      return next;
    });
    setMessage("");
  }

  function checkAnswer(): void {
    const isCorrect = board.every((row, rowIndex) =>
      row.every((cell, colIndex) => {
        const shouldBeFilled = SOLUTION[rowIndex][colIndex];
        return shouldBeFilled ? cell === "filled" : cell !== "filled";
      })
    );

    if (isCorrect) {
      setMessage("");
      setShowVictory(true);
      return;
    }

    setMessage("Ikke helt riktig ennå.");
  }

  function handleCloseVictory(): void {
    setShowVictory(false);
    onSolved();
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-stone-700 md:max-w-[600px]">
        Tallene ved hver rad og kolonne viser hvor mange sammenhengende fylte
        ruter det skal være. Tallene står i rekkefølge og må ha minst én tom
        rute mellom seg. Klikk én gang for å fylle en rute, én gang til for å
        markere den med X, og én gang til for å tømme den igjen.
      </p>

      <div className="overflow-x-auto">
        <div
          className="mx-auto w-fit"
          style={{
            display: "grid",
            gridTemplateColumns: `${maxRowClues * CLUE_CELL_SIZE}px ${
              GRID_SIZE * CELL_SIZE
            }px`,
            gridTemplateRows: `${maxColClues * CLUE_CELL_SIZE}px ${
              GRID_SIZE * CELL_SIZE
            }px`,
            gap: 0,
          }}
        >
          <div />

          {/* Top clues */}
          <div
            className="border-t-2 border-l-2 border-r-2 border-stone-800"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
              gridTemplateRows: `repeat(${maxColClues}, ${CLUE_CELL_SIZE}px)`,
            }}
          >
            {Array.from({ length: maxColClues }).map((_, rowIndex) =>
              COL_CLUES.map((clues, colIndex) => {
                const padded = Array(maxColClues - clues.length)
                  .fill(null)
                  .concat(clues);

                return (
                  <div
                    key={`col-${rowIndex}-${colIndex}`}
                    className={[
                      "flex items-end justify-center text-2xl font-semibold text-stone-800",
                      colIndex !== GRID_SIZE - 1
                        ? "border-r border-stone-800"
                        : "",
                    ].join(" ")}
                  >
                    {padded[rowIndex] ?? ""}
                  </div>
                );
              })
            )}
          </div>

          {/* Left clues */}
          <div
            className="border-l-2 border-b-2 border-t-2 border-r-2 border-stone-800"
            style={{
              display: "grid",
              gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
              width: `${maxRowClues * CLUE_CELL_SIZE}px`,
            }}
          >
            {ROW_CLUES.map((clues, rowIndex) => {
              const padded = Array(maxRowClues - clues.length)
                .fill(null)
                .concat(clues);

              return (
                <div
                  key={`row-clues-${rowIndex}`}
                  className={[
                    "grid items-center",
                    rowIndex !== GRID_SIZE - 1
                      ? "border-b border-stone-800"
                      : "",
                  ].join(" ")}
                  style={{
                    gridTemplateColumns: `repeat(${maxRowClues}, ${CLUE_CELL_SIZE}px)`,
                    height: `${CELL_SIZE}px`,
                  }}
                >
                  {padded.map((clue, clueIndex) => (
                    <div
                      key={`row-${rowIndex}-${clueIndex}`}
                      className="flex items-center justify-center text-2xl font-semibold text-stone-800"
                    >
                      {clue ?? ""}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Main grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
            }}
            className="border-r-2 border-b-2 border-stone-800"
          >
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const isFilled = cell === "filled";
                const isCrossed = cell === "crossed";
                const isLastCol = colIndex === GRID_SIZE - 1;
                const isLastRow = rowIndex === GRID_SIZE - 1;

                return (
                  <button
                    key={`cell-${rowIndex}-${colIndex}`}
                    type="button"
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    className={[
                      "relative bg-white border-r border-b border-stone-800",
                      isLastCol ? "border-r-0" : "",
                      isLastRow ? "border-b-0" : "",
                    ].join(" ")}
                    style={{
                      width: `${CELL_SIZE}px`,
                      height: `${CELL_SIZE}px`,
                    }}
                    aria-label={`Cell ${rowIndex + 1}, ${colIndex + 1}`}
                  >
                    {isFilled && (
                      <div className="absolute inset-[6px] bg-black" />
                    )}

                    {isCrossed && (
                      <>
                        <div className="absolute left-1/2 top-1/2 h-[1px] w-9 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-red-500" />
                        <div className="absolute left-1/2 top-1/2 h-[1px] w-9 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-red-500" />
                      </>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={checkAnswer}
          className="rounded bg-stone-900 px-4 py-2 text-white transition hover:bg-black"
        >
          Sjekk svar
        </button>

        {message && <p className="text-sm text-stone-700">{message}</p>}
      </div>
      <GameSuccessOverlay
        open={showVictory}
        title="Gratulerer!"
        message="Dere løste oppgaven!"
        buttonText="OK"
        onClose={handleCloseVictory}
      />
    </div>
  );
}
