import React, { useMemo, useState } from "react";
import GameSuccessOverlay from "../GamesSuccessOverlay";

type PipePuzzleGameProps = {
  onSolved: () => void;
};

type Direction = "N" | "E" | "S" | "W";

type Tile = {
  connections: Direction[];
  rotation: number;
  isStart?: boolean;
};

const GRID_SIZE = 5;
const TILE_SIZE = 64;

const DELTAS: Record<Direction, { row: number; col: number }> = {
  N: { row: -1, col: 0 },
  E: { row: 0, col: 1 },
  S: { row: 1, col: 0 },
  W: { row: 0, col: -1 },
};

const OPPOSITE: Record<Direction, Direction> = {
  N: "S",
  E: "W",
  S: "N",
  W: "E",
};

const ROTATE_CLOCKWISE: Record<Direction, Direction> = {
  N: "E",
  E: "S",
  S: "W",
  W: "N",
};

const SOLUTION_GRID: Tile[][] = [
  [
    { connections: ["E"], rotation: 0 },
    { connections: ["S", "W"], rotation: 0 },
    { connections: ["E", "S"], rotation: 0 },
    { connections: ["E", "W"], rotation: 0 },
    { connections: ["S", "W"], rotation: 0 },
  ],
  [
    { connections: ["E", "S"], rotation: 0, isStart: true },
    { connections: ["N", "E", "W"], rotation: 0 },
    { connections: ["N", "E", "W"], rotation: 0 },
    { connections: ["S", "W"], rotation: 0 },
    { connections: ["N", "S"], rotation: 0 },
  ],
  [
    { connections: ["N", "E"], rotation: 0 },
    { connections: ["E", "W"], rotation: 0 },
    { connections: ["E", "S", "W"], rotation: 0 },
    { connections: ["N", "E", "S", "W"], rotation: 0 },
    { connections: ["N", "S", "W"], rotation: 0 },
  ],
  [
    { connections: ["E"], rotation: 0 },
    { connections: ["S", "W"], rotation: 0 },
    { connections: ["N", "E"], rotation: 0 },
    { connections: ["N", "E", "W"], rotation: 0 },
    { connections: ["N", "S", "W"], rotation: 0 },
  ],
  [
    { connections: ["E"], rotation: 0 },
    { connections: ["N", "E", "W"], rotation: 0 },
    { connections: ["E", "W"], rotation: 0 },
    { connections: ["E", "W"], rotation: 0 },
    { connections: ["N", "W"], rotation: 0 },
  ],
];

const START_ROTATIONS: number[][] = [
  [1, 1, 2, 2, 0],
  [2, 3, 1, 0, 2],
  [3, 2, 1, 2, 1],
  [1, 0, 3, 2, 1],
  [2, 1, 0, 2, 3],
];

function rotateDirections(
  directions: Direction[],
  rotation: number
): Direction[] {
  let next = [...directions];

  for (let i = 0; i < rotation; i += 1) {
    next = next.map((direction) => ROTATE_CLOCKWISE[direction]);
  }

  return next;
}

function createBoard(): Tile[][] {
  return SOLUTION_GRID.map((row, rowIndex) =>
    row.map((tile, colIndex) => ({
      ...tile,
      rotation: START_ROTATIONS[rowIndex][colIndex],
    }))
  );
}

function getStartPosition(board: Tile[][]): { row: number; col: number } {
  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      if (board[row][col].isStart) {
        return { row, col };
      }
    }
  }

  return { row: 0, col: 0 };
}

function getConnectedCells(board: Tile[][]): Set<string> {
  const connected = new Set<string>();
  const queue: Array<{ row: number; col: number }> = [getStartPosition(board)];

  while (queue.length > 0) {
    const current = queue.shift();

    if (!current) {
      continue;
    }

    const key = `${current.row}-${current.col}`;

    if (connected.has(key)) {
      continue;
    }

    connected.add(key);

    const tile = board[current.row][current.col];
    const directions = rotateDirections(tile.connections, tile.rotation);

    directions.forEach((direction) => {
      const delta = DELTAS[direction];
      const nextRow = current.row + delta.row;
      const nextCol = current.col + delta.col;

      if (
        nextRow < 0 ||
        nextRow >= GRID_SIZE ||
        nextCol < 0 ||
        nextCol >= GRID_SIZE
      ) {
        return;
      }

      const neighbor = board[nextRow][nextCol];
      const neighborDirections = rotateDirections(
        neighbor.connections,
        neighbor.rotation
      );

      if (neighborDirections.includes(OPPOSITE[direction])) {
        queue.push({ row: nextRow, col: nextCol });
      }
    });
  }

  return connected;
}

function isSolved(board: Tile[][]): boolean {
  const connected = getConnectedCells(board);

  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      const tile = board[row][col];
      const directions = rotateDirections(tile.connections, tile.rotation);

      if (!connected.has(`${row}-${col}`)) {
        return false;
      }

      for (const direction of directions) {
        const delta = DELTAS[direction];
        const nextRow = row + delta.row;
        const nextCol = col + delta.col;

        if (
          nextRow < 0 ||
          nextRow >= GRID_SIZE ||
          nextCol < 0 ||
          nextCol >= GRID_SIZE
        ) {
          return false;
        }

        const neighbor = board[nextRow][nextCol];
        const neighborDirections = rotateDirections(
          neighbor.connections,
          neighbor.rotation
        );

        if (!neighborDirections.includes(OPPOSITE[direction])) {
          return false;
        }
      }
    }
  }

  return true;
}

function getPipeColor(isConnected: boolean): string {
  return isConnected ? "#3b82f6" : "#1f2937";
}

function renderPipe(
  tile: Tile,
  isConnected: boolean,
  rowIndex: number,
  colIndex: number
): React.JSX.Element {
  const directions = rotateDirections(tile.connections, tile.rotation);
  const color = getPipeColor(isConnected);

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
      {directions.includes("N") && (
        <rect x="43" y="0" width="14" height="50" rx="7" fill={color} />
      )}
      {directions.includes("E") && (
        <rect x="50" y="43" width="50" height="14" rx="7" fill={color} />
      )}
      {directions.includes("S") && (
        <rect x="43" y="50" width="14" height="50" rx="7" fill={color} />
      )}
      {directions.includes("W") && (
        <rect x="0" y="43" width="50" height="14" rx="7" fill={color} />
      )}

      <circle cx="50" cy="50" r="12" fill={color} />

      {tile.isStart && (
        <>
          <circle
            cx="50"
            cy="50"
            r="28"
            fill="none"
            stroke="#93c5fd"
            strokeWidth="4"
            strokeDasharray="6 6"
          />
          <circle cx="50" cy="50" r="8" fill="#60a5fa" />
        </>
      )}

      <title>{`Pipe ${rowIndex + 1}, ${colIndex + 1}`}</title>
    </svg>
  );
}

export default function PipePuzzleGame({
  onSolved,
}: PipePuzzleGameProps): React.JSX.Element {
  const [board, setBoard] = useState<Tile[][]>(createBoard);
  const [message, setMessage] = useState("");
  const [showVictory, setShowVictory] = useState(false);

  const connected = useMemo(() => getConnectedCells(board), [board]);

  function handleTileClick(row: number, col: number): void {
    if (showVictory) {
      return;
    }

    setBoard((prev) => {
      const next = prev.map((boardRow) =>
        boardRow.map((tile) => ({ ...tile }))
      );
      next[row][col].rotation = (next[row][col].rotation + 1) % 4;
      return next;
    });
    setMessage("");
  }

  function checkAnswer(): void {
    const solved = isSolved(board);

    if (solved) {
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
    <>
      <div className="space-y-4">
        <p className="text-sm text-stone-700">
          Klikk på rørene for å rotere dem. Alle rørene må kobles til
          vannkilden, og blå farge viser hvilke rør som har vann.
        </p>

        <div className="overflow-x-auto">
          <div
            className="mx-auto grid w-fit gap-2 rounded-xl bg-stone-200 p-2"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, ${TILE_SIZE}px)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, ${TILE_SIZE}px)`,
            }}
          >
            {board.map((row, rowIndex) =>
              row.map((tile, colIndex) => {
                const isConnected = connected.has(`${rowIndex}-${colIndex}`);

                return (
                  <button
                    key={`tile-${rowIndex}-${colIndex}`}
                    type="button"
                    onClick={() => handleTileClick(rowIndex, colIndex)}
                    className="flex items-center justify-center rounded-lg border border-stone-300 bg-white p-1 transition hover:bg-stone-50"
                    style={{
                      width: `${TILE_SIZE}px`,
                      height: `${TILE_SIZE}px`,
                    }}
                    aria-label={`Pipe ${rowIndex + 1}, ${colIndex + 1}`}
                  >
                    {renderPipe(tile, isConnected, rowIndex, colIndex)}
                  </button>
                );
              })
            )}
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

      <GameSuccessOverlay
        open={showVictory}
        title="Gratulerer!"
        message="Du koblet sammen rørsystemet!"
        buttonText="OK"
        onClose={handleCloseVictory}
      />
    </>
  );
}
