import React, { useState } from "react";

type BinairoGameProps = {
  onSolved: () => void;
};

type CellState = "empty" | "black" | "white";
type ConstraintType = "equal" | "different";

type Constraint = {
  row: number;
  col: number;
  direction: "horizontal" | "vertical";
  type: ConstraintType;
};

const GRID_SIZE = 8;
// const CELL_SIZE = 64;

const START_BOARD: CellState[][] = [
  ["empty", "black", "empty", "empty", "white", "empty", "empty", "empty"],
  ["empty", "empty", "empty", "empty", "white", "empty", "black", "empty"],
  ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "black"],
  ["empty", "empty", "white", "empty", "empty", "white", "empty", "empty"],
  ["empty", "empty", "black", "empty", "empty", "black", "empty", "empty"],
  ["white", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
  ["empty", "white", "empty", "white", "empty", "empty", "empty", "empty"],
  ["empty", "empty", "empty", "white", "empty", "empty", "black", "empty"],
];

/* const SOLUTION: CellState[][] = [
  ["black", "black", "white", "black", "white", "black", "white", "white"],
  ["white", "white", "black", "black", "white", "white", "black", "black"],
  ["white", "black", "white", "white", "black", "black", "white", "black"],
  ["black", "white", "white", "black", "black", "white", "black", "white"],
  ["black", "white", "black", "white", "white", "black", "white", "black"],
  ["white", "black", "white", "black", "white", "black", "black", "white"],
  ["black", "white", "black", "white", "black", "white", "white", "black"],
  ["white", "black", "black", "white", "black", "white", "black", "white"],
]; */

const CONSTRAINTS: Constraint[] = [
  { row: 1, col: 0, direction: "vertical", type: "equal" },
  { row: 2, col: 1, direction: "horizontal", type: "different" },
  { row: 2, col: 1, direction: "vertical", type: "different" },
  { row: 2, col: 4, direction: "horizontal", type: "equal" },
  { row: 2, col: 6, direction: "vertical", type: "different" },
  { row: 3, col: 1, direction: "vertical", type: "equal" },
  { row: 3, col: 6, direction: "vertical", type: "different" },
  { row: 4, col: 1, direction: "vertical", type: "different" },
  { row: 4, col: 6, direction: "vertical", type: "different" },
  { row: 5, col: 2, direction: "horizontal", type: "different" },
  { row: 5, col: 5, direction: "horizontal", type: "equal" },
  { row: 5, col: 7, direction: "vertical", type: "different" },
];

function createBoard(): CellState[][] {
  return START_BOARD.map((row) => [...row]);
}

function nextCellState(cell: CellState): CellState {
  if (cell === "empty") return "black";
  if (cell === "black") return "white";
  return "empty";
}

function isGivenCell(row: number, col: number): boolean {
  return START_BOARD[row][col] !== "empty";
}

function countInLine(line: CellState[], target: CellState): number {
  return line.filter((cell) => cell === target).length;
}

function hasTooManyAdjacent(line: CellState[]): boolean {
  for (let i = 0; i <= line.length - 3; i += 1) {
    const a = line[i];
    const b = line[i + 1];
    const c = line[i + 2];

    if (a !== "empty" && a === b && b === c) {
      return true;
    }
  }

  return false;
}

function satisfiesConstraint(
  board: CellState[][],
  constraint: Constraint
): boolean {
  const first = board[constraint.row][constraint.col];
  const second =
    constraint.direction === "horizontal"
      ? board[constraint.row][constraint.col + 1]
      : board[constraint.row + 1][constraint.col];

  if (first === "empty" || second === "empty") {
    return false;
  }

  if (constraint.type === "equal") {
    return first === second;
  }

  return first !== second;
}

function isBoardSolved(board: CellState[][]): boolean {
  for (let row = 0; row < GRID_SIZE; row += 1) {
    const rowCells = board[row];
    if (rowCells.includes("empty")) {
      return false;
    }
    if (countInLine(rowCells, "black") !== GRID_SIZE / 2) {
      return false;
    }
    if (countInLine(rowCells, "white") !== GRID_SIZE / 2) {
      return false;
    }
    if (hasTooManyAdjacent(rowCells)) {
      return false;
    }
  }

  for (let col = 0; col < GRID_SIZE; col += 1) {
    const columnCells = Array.from(
      { length: GRID_SIZE },
      (_, row) => board[row][col]
    );
    if (countInLine(columnCells, "black") !== GRID_SIZE / 2) {
      return false;
    }
    if (countInLine(columnCells, "white") !== GRID_SIZE / 2) {
      return false;
    }
    if (hasTooManyAdjacent(columnCells)) {
      return false;
    }
  }

  return CONSTRAINTS.every((constraint) =>
    satisfiesConstraint(board, constraint)
  );
}

function renderCircle(
  cell: CellState,
  isGiven: boolean
): React.JSX.Element | null {
  if (cell === "empty") {
    return null;
  }

  if (cell === "black") {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-black">
        {isGiven && <div className="h-2.5 w-2.5 rounded-sm bg-white/45" />}
      </div>
    );
  }

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-white">
      {isGiven && <div className="h-2.5 w-2.5 rounded-sm bg-black/20" />}
    </div>
  );
}

function renderConstraintSymbol(type: ConstraintType): React.JSX.Element {
  if (type === "equal") {
    return (
      <span className="text-[28px] font-normal leading-none text-stone-400 sm:text-[40px]">
        =
      </span>
    );
  }

  return (
    <span className="text-[28px] font-normal leading-none text-stone-400 sm:text-[40px]">
      ×
    </span>
  );
}

export default function BinairoGame({
  onSolved,
}: BinairoGameProps): React.JSX.Element {
  const [board, setBoard] = useState<CellState[][]>(createBoard);
  const [message, setMessage] = useState("");
  const [hasSolved, setHasSolved] = useState(false);

  function handleCellClick(row: number, col: number): void {
    if (isGivenCell(row, col)) {
      return;
    }

    setBoard((prev) => {
      const next = prev.map((boardRow) => [...boardRow]);
      next[row][col] = nextCellState(next[row][col]);
      return next;
    });
    setMessage("");
  }

  function checkAnswer(): void {
    const solved = isBoardSolved(board);

    if (solved) {
      setMessage("Riktig! Binairo-brettet er løst.");
      if (!hasSolved) {
        setHasSolved(true);
        onSolved();
      }
      return;
    }

    setMessage("Ikke helt riktig ennå.");
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-stone-700 md:max-w-[600px]">
        Klikk på en tom rute for å sette inn en svart sirkel. Klikk igjen for å
        bytte til hvit, og én gang til for å tømme ruten. Hver rad og kolonne må
        ha like mange svarte og hvite sirkler, aldri tre like på rad, og tegnene
        mellom rutene må stemme.
      </p>

      <div className="overflow-x-auto">
        <div className="mx-auto w-full max-w-[720px]">
          <div
            className="relative mx-auto w-fit border border-stone-300 bg-stone-100 p-4 sm:p-8"
            style={{ width: "100%" }}
          >
            <div
              className="relative mx-auto aspect-square w-full max-w-[512px] border border-stone-300 bg-stone-100"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
              }}
            >
              {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                  const given = isGivenCell(rowIndex, colIndex);

                  return (
                    <button
                      key={`cell-${rowIndex}-${colIndex}`}
                      type="button"
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      className="relative flex aspect-square items-center justify-center border-r border-b border-stone-300 bg-stone-100"
                      style={{
                        borderTop:
                          rowIndex === 0
                            ? "1px solid rgb(212 212 216)"
                            : undefined,
                        borderLeft:
                          colIndex === 0
                            ? "1px solid rgb(212 212 216)"
                            : undefined,
                        cursor: given ? "default" : "pointer",
                      }}
                      aria-label={`Cell ${rowIndex + 1}, ${colIndex + 1}`}
                    >
                      <div className="scale-[0.72] sm:scale-100">
                        {renderCircle(cell, given)}
                      </div>
                    </button>
                  );
                })
              )}

              {CONSTRAINTS.map((constraint, index) => {
                const left =
                  constraint.direction === "horizontal"
                    ? `calc(${((constraint.col + 1) / GRID_SIZE) * 100}%)`
                    : `calc(${((constraint.col + 0.5) / GRID_SIZE) * 100}%)`;
                const top =
                  constraint.direction === "horizontal"
                    ? `calc(${((constraint.row + 0.5) / GRID_SIZE) * 100}%)`
                    : `calc(${((constraint.row + 1) / GRID_SIZE) * 100}%)`;

                return (
                  <div
                    key={`constraint-${index}`}
                    className="pointer-events-none absolute flex h-10 w-6 items-center justify-center sm:h-14 sm:w-8"
                    style={{
                      left,
                      top,
                      transform:
                        constraint.direction === "horizontal"
                          ? "translate(-50%, -50%) translateX(-2px)"
                          : "translate(-50%, -50%) translateY(-2px)",
                    }}
                  >
                    {renderConstraintSymbol(constraint.type)}
                  </div>
                );
              })}
            </div>
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
    </div>
  );
}
