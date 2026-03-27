import React, { useEffect, useMemo, useRef, useState } from "react";

type ColorConnectionsGameProps = {
  onSolved: () => void;
};

type Position = {
  row: number;
  col: number;
};

type ColorId =
  | "blue"
  | "green"
  | "cyan"
  | "pink"
  | "orange"
  | "brown"
  | "red"
  | "yellow";

type PairDefinition = {
  id: ColorId;
  color: string;
  start: Position;
  end: Position;
};

type PathsState = Record<ColorId, Position[]>;

const GRID_SIZE = 9;

const PAIRS: PairDefinition[] = [
  {
    id: "blue",
    color: "#1d26ff",
    start: { row: 0, col: 0 },
    end: { row: 1, col: 8 },
  },
  {
    id: "green",
    color: "#029a00",
    start: { row: 1, col: 0 },
    end: { row: 7, col: 4 },
  },
  {
    id: "cyan",
    color: "#20e7ef",
    start: { row: 2, col: 3 },
    end: { row: 8, col: 8 },
  },
  {
    id: "pink",
    color: "#ff16f4",
    start: { row: 1, col: 5 },
    end: { row: 1, col: 7 },
  },
  {
    id: "orange",
    color: "#ff9500",
    start: { row: 3, col: 5 },
    end: { row: 2, col: 8 },
  },
  {
    id: "brown",
    color: "#a7362f",
    start: { row: 5, col: 2 },
    end: { row: 6, col: 4 },
  },
  {
    id: "red",
    color: "#ff1b13",
    start: { row: 4, col: 7 },
    end: { row: 6, col: 7 },
  },
  {
    id: "yellow",
    color: "#f4ef00",
    start: { row: 6, col: 2 },
    end: { row: 6, col: 6 },
  },
];

function posKey(pos: Position): string {
  return `${pos.row}-${pos.col}`;
}

function samePos(a: Position, b: Position): boolean {
  return a.row === b.row && a.col === b.col;
}

function isAdjacent(a: Position, b: Position): boolean {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1;
}

function createInitialPaths(): PathsState {
  return {
    blue: [],
    green: [],
    cyan: [],
    pink: [],
    orange: [],
    brown: [],
    red: [],
    yellow: [],
  };
}

export default function ColorConnectionsGame({
  onSolved,
}: ColorConnectionsGameProps): React.JSX.Element {
  const [paths, setPaths] = useState<PathsState>(createInitialPaths);
  const [activeColor, setActiveColor] = useState<ColorId | null>(null);
  const [message, setMessage] = useState("");
  const boardRef = useRef<HTMLDivElement | null>(null);

  const endpointMap = useMemo(() => {
    const map = new Map<string, { colorId: ColorId; isStart: boolean }>();

    for (const pair of PAIRS) {
      map.set(posKey(pair.start), { colorId: pair.id, isStart: true });
      map.set(posKey(pair.end), { colorId: pair.id, isStart: false });
    }

    return map;
  }, []);

  useEffect(() => {
    function handlePointerUp(): void {
      setActiveColor(null);
    }

    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, []);

  function getPair(colorId: ColorId): PairDefinition | undefined {
    return PAIRS.find((pair) => pair.id === colorId);
  }

  function getTargetEndpoint(
    colorId: ColorId,
    path: Position[]
  ): Position | null {
    const pair = getPair(colorId);
    if (!pair || path.length === 0) return null;

    if (samePos(path[0], pair.start)) return pair.end;
    if (samePos(path[0], pair.end)) return pair.start;

    return null;
  }

  function getOccupiedColorAt(
    pos: Position,
    currentPaths: PathsState
  ): ColorId | null {
    const endpoint = endpointMap.get(posKey(pos));
    if (endpoint) return endpoint.colorId;

    for (const pair of PAIRS) {
      const path = currentPaths[pair.id];
      if (path.some((cell) => samePos(cell, pos))) {
        return pair.id;
      }
    }

    return null;
  }

  function handleActivatePath(colorId: ColorId, cell: Position): void {
    setPaths((prev) => {
      const currentPath = prev[colorId];
      const pair = getPair(colorId);
      if (!pair) return prev;

      if (currentPath.length === 0) {
        return {
          ...prev,
          [colorId]: [cell],
        };
      }

      if (samePos(cell, pair.start)) {
        return {
          ...prev,
          [colorId]: [pair.start],
        };
      }

      if (samePos(cell, pair.end)) {
        return {
          ...prev,
          [colorId]: [pair.end],
        };
      }

      const last = currentPath[currentPath.length - 1];
      if (samePos(cell, last)) {
        return prev;
      }

      return prev;
    });

    setActiveColor(colorId);
    setMessage("");
  }

  function extendPathToCell(cell: Position): void {
    if (!activeColor) return;

    setPaths((prev) => {
      const currentPath = prev[activeColor];
      if (currentPath.length === 0) return prev;

      const last = currentPath[currentPath.length - 1];
      if (!isAdjacent(last, cell)) return prev;

      const previous = currentPath[currentPath.length - 2];
      if (previous && samePos(previous, cell)) {
        return {
          ...prev,
          [activeColor]: currentPath.slice(0, -1),
        };
      }

      const currentIndex = currentPath.findIndex((pos) => samePos(pos, cell));
      if (currentIndex >= 0) {
        return {
          ...prev,
          [activeColor]: currentPath.slice(0, currentIndex + 1),
        };
      }

      const target = getTargetEndpoint(activeColor, currentPath);
      const occupiedBy = getOccupiedColorAt(cell, prev);

      if (occupiedBy && occupiedBy !== activeColor) {
        return prev;
      }

      const endpoint = endpointMap.get(posKey(cell));
      if (endpoint && endpoint.colorId === activeColor) {
        if (target && samePos(cell, target)) {
          return {
            ...prev,
            [activeColor]: [...currentPath, cell],
          };
        }

        return prev;
      }

      return {
        ...prev,
        [activeColor]: [...currentPath, cell],
      };
    });
  }

  function getCellFromPoint(clientX: number, clientY: number): Position | null {
    const element = document.elementFromPoint(
      clientX,
      clientY
    ) as HTMLElement | null;
    if (!element) return null;

    const cellElement = element.closest("[data-cell]") as HTMLElement | null;
    if (!cellElement) return null;

    const row = cellElement.dataset.row;
    const col = cellElement.dataset.col;

    if (row == null || col == null) return null;

    return {
      row: Number(row),
      col: Number(col),
    };
  }

  function handleBoardPointerMove(
    event: React.PointerEvent<HTMLDivElement>
  ): void {
    if (!activeColor) return;

    const cell = getCellFromPoint(event.clientX, event.clientY);
    if (!cell) return;

    extendPathToCell(cell);
  }

  const connectedColors = useMemo(() => {
    const result: Record<ColorId, boolean> = {
      blue: false,
      green: false,
      cyan: false,
      pink: false,
      orange: false,
      brown: false,
      red: false,
      yellow: false,
    };

    for (const pair of PAIRS) {
      const path = paths[pair.id];
      if (path.length < 2) continue;

      const startsAtStart = samePos(path[0], pair.start);
      const startsAtEnd = samePos(path[0], pair.end);
      const endsAtStart = samePos(path[path.length - 1], pair.start);
      const endsAtEnd = samePos(path[path.length - 1], pair.end);

      result[pair.id] =
        (startsAtStart && endsAtEnd) || (startsAtEnd && endsAtStart);
    }

    return result;
  }, [paths]);

  const allSolved = useMemo(
    () => PAIRS.every((pair) => connectedColors[pair.id]),
    [connectedColors]
  );

  useEffect(() => {
    if (allSolved) {
      setMessage("All colors connected!");
      onSolved();
    }
  }, [allSolved, onSolved]);

  function getColorAtCell(cell: Position): ColorId | null {
    const endpoint = endpointMap.get(posKey(cell));
    if (endpoint) return endpoint.colorId;

    for (const pair of PAIRS) {
      const path = paths[pair.id];
      if (path.some((p) => samePos(p, cell))) {
        return pair.id;
      }
    }

    return null;
  }

  function hasConnection(
    cell: Position,
    colorId: ColorId,
    direction: "up" | "down" | "left" | "right"
  ): boolean {
    const neighbor =
      direction === "up"
        ? { row: cell.row - 1, col: cell.col }
        : direction === "down"
        ? { row: cell.row + 1, col: cell.col }
        : direction === "left"
        ? { row: cell.row, col: cell.col - 1 }
        : { row: cell.row, col: cell.col + 1 };

    if (
      neighbor.row < 0 ||
      neighbor.row >= GRID_SIZE ||
      neighbor.col < 0 ||
      neighbor.col >= GRID_SIZE
    ) {
      return false;
    }

    const neighborColor = getColorAtCell(neighbor);
    return neighborColor === colorId;
  }

  function getTailColorAtCell(cell: Position): ColorId | null {
    for (const pair of PAIRS) {
      const path = paths[pair.id];
      if (path.length === 0) continue;

      const last = path[path.length - 1];
      if (samePos(last, cell)) {
        return pair.id;
      }
    }

    return null;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-stone-700">
        Drag between matching colors. You can stop halfway and continue later by
        tapping the end of an unfinished line.
      </p>

      <div className="mx-auto w-fit rounded-xl border border-stone-500 bg-[#58685b] p-2 shadow-lg">
        <div
          ref={boardRef}
          onPointerMove={handleBoardPointerMove}
          className="grid touch-none select-none"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 3.2rem)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 3.2rem)`,
            touchAction: "none",
          }}
        >
          {Array.from({ length: GRID_SIZE }).map((_, row) =>
            Array.from({ length: GRID_SIZE }).map((__, col) => {
              const cell = { row, col };
              const endpoint = endpointMap.get(posKey(cell));
              const colorId = getColorAtCell(cell);
              const tailColor = getTailColorAtCell(cell);
              const pair = colorId ? getPair(colorId) ?? null : null;

              return (
                <div
                  key={`${row}-${col}`}
                  data-cell="true"
                  data-row={row}
                  data-col={col}
                  className="relative border border-[#8d8f56] bg-[#6d7867]"
                >
                  {pair && (
                    <>
                      {hasConnection(cell, pair.id, "up") && (
                        <div
                          className="absolute left-1/2 top-0 w-[22%] -translate-x-1/2"
                          style={{
                            height: "50%",
                            backgroundColor: pair.color,
                          }}
                        />
                      )}
                      {hasConnection(cell, pair.id, "down") && (
                        <div
                          className="absolute bottom-0 left-1/2 w-[22%] -translate-x-1/2"
                          style={{
                            height: "50%",
                            backgroundColor: pair.color,
                          }}
                        />
                      )}
                      {hasConnection(cell, pair.id, "left") && (
                        <div
                          className="absolute left-0 top-1/2 h-[22%] -translate-y-1/2"
                          style={{
                            width: "50%",
                            backgroundColor: pair.color,
                          }}
                        />
                      )}
                      {hasConnection(cell, pair.id, "right") && (
                        <div
                          className="absolute right-0 top-1/2 h-[22%] -translate-y-1/2"
                          style={{
                            width: "50%",
                            backgroundColor: pair.color,
                          }}
                        />
                      )}

                      <div
                        className="absolute left-1/2 top-1/2 h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-sm"
                        style={{ backgroundColor: pair.color }}
                      />
                    </>
                  )}

                  {endpoint ? (
                    <button
                      type="button"
                      onPointerDown={(event) => {
                        event.preventDefault();
                        const pairDef = getPair(endpoint.colorId);
                        if (!pairDef) return;

                        handleActivatePath(
                          endpoint.colorId,
                          endpoint.isStart ? pairDef.start : pairDef.end
                        );
                      }}
                      className="absolute inset-0 z-10 flex items-center justify-center touch-none"
                      style={{ touchAction: "none" }}
                      aria-label={`Start ${endpoint.colorId} path`}
                    >
                      <div
                        className="h-[62%] w-[62%] rounded-full shadow-md"
                        style={{
                          backgroundColor:
                            getPair(endpoint.colorId)?.color ?? "#000",
                        }}
                      />
                    </button>
                  ) : tailColor ? (
                    <button
                      type="button"
                      onPointerDown={(event) => {
                        event.preventDefault();
                        handleActivatePath(tailColor, cell);
                      }}
                      className="absolute inset-0 z-10 touch-none"
                      style={{ touchAction: "none" }}
                      aria-label={`Continue ${tailColor} path`}
                    />
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {PAIRS.map((pair) => (
          <div
            key={pair.id}
            className={`rounded-full px-3 py-1 text-sm ${
              connectedColors[pair.id]
                ? "bg-green-100 text-green-800"
                : "bg-stone-200 text-stone-700"
            }`}
          >
            {pair.id}
          </div>
        ))}
      </div>

      {message && <p className="text-sm text-stone-700">{message}</p>}
    </div>
  );
}
