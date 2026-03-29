import React, { useMemo, useRef, useState } from "react";

type BlockEscapeGameProps = {
  onSolved: () => void;
};

type Block = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: "goal" | "blue";
};

type Point = {
  x: number;
  y: number;
};

const COLS = 4;
const ROWS = 3;
const CELL_SIZE = 72;
const GAP = 6;
const BOARD_PADDING = 12;
const EXIT_COL = 2;
const EXIT_WIDTH = 2;
const EXIT_HEIGHT = 24;

const INITIAL_BLOCKS: Block[] = [
  { id: "top-horizontal", x: 1, y: 0, w: 2, h: 1, color: "blue" },
  { id: "top-right", x: 3, y: 0, w: 1, h: 1, color: "blue" },
  { id: "left-square", x: 0, y: 1, w: 1, h: 1, color: "blue" },
  { id: "goal", x: 1, y: 1, w: 2, h: 1, color: "goal" },
  { id: "right-vertical", x: 3, y: 1, w: 1, h: 2, color: "blue" },
  { id: "bottom-left", x: 1, y: 2, w: 1, h: 1, color: "blue" },
  { id: "bottom-middle", x: 2, y: 2, w: 1, h: 1, color: "blue" },
];

function cloneBlocks(blocks: Block[]): Block[] {
  return blocks.map((block) => ({ ...block }));
}

function getCellStep(): number {
  return CELL_SIZE + GAP;
}

function getPixelX(gridX: number): number {
  return BOARD_PADDING + gridX * getCellStep();
}

function getPixelY(gridY: number): number {
  return BOARD_PADDING + EXIT_HEIGHT + gridY * getCellStep();
}

function getBlockWidth(block: Block): number {
  return block.w * CELL_SIZE + (block.w - 1) * GAP;
}

function getBlockHeight(block: Block): number {
  return block.h * CELL_SIZE + (block.h - 1) * GAP;
}

function occupiesCell(block: Block, cellX: number, cellY: number): boolean {
  return (
    cellX >= block.x &&
    cellX < block.x + block.w &&
    cellY >= block.y &&
    cellY < block.y + block.h
  );
}

function isInsideBoard(cellX: number, cellY: number): boolean {
  return cellX >= 0 && cellX < COLS && cellY >= 0 && cellY < ROWS;
}

function canPlaceBlock(
  blocks: Block[],
  movingBlock: Block,
  nextX: number,
  nextY: number
): boolean {
  const isGoalExiting =
    movingBlock.id === "goal" &&
    nextX === EXIT_COL &&
    nextY === -1 &&
    movingBlock.w === EXIT_WIDTH;

  for (let dy = 0; dy < movingBlock.h; dy += 1) {
    for (let dx = 0; dx < movingBlock.w; dx += 1) {
      const cellX = nextX + dx;
      const cellY = nextY + dy;

      if (isGoalExiting && cellY === -1) {
        if (cellX < EXIT_COL || cellX >= EXIT_COL + EXIT_WIDTH) {
          return false;
        }
        continue;
      }

      if (!isInsideBoard(cellX, cellY)) {
        return false;
      }

      const hasCollision = blocks.some((other) => {
        if (other.id === movingBlock.id) {
          return false;
        }

        return occupiesCell(other, cellX, cellY);
      });

      if (hasCollision) {
        return false;
      }
    }
  }

  return true;
}

function getAvailableMoves(
  blocks: Block[],
  block: Block
): Array<{ x: number; y: number }> {
  const moves: Array<{ x: number; y: number }> = [];
  const directions = [
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
  ];

  directions.forEach(({ dx, dy }) => {
    const nextX = block.x + dx;
    const nextY = block.y + dy;

    if (canPlaceBlock(blocks, block, nextX, nextY)) {
      moves.push({ x: nextX, y: nextY });
    }
  });

  return moves;
}

function getMoveLimits(
  blocks: Block[],
  block: Block
): {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
} {
  let minX = block.x;
  let maxX = block.x;
  let minY = block.y;
  let maxY = block.y;

  while (canPlaceBlock(blocks, block, minX - 1, block.y)) {
    minX -= 1;
  }

  while (canPlaceBlock(blocks, block, maxX + 1, block.y)) {
    maxX += 1;
  }

  while (canPlaceBlock(blocks, block, block.x, minY - 1)) {
    minY -= 1;
  }

  while (canPlaceBlock(blocks, block, block.x, maxY + 1)) {
    maxY += 1;
  }

  return { minX, maxX, minY, maxY };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function isSamePosition(
  a: { x: number; y: number },
  b: { x: number; y: number }
): boolean {
  return a.x === b.x && a.y === b.y;
}

export default function BlockEscapeGame({
  onSolved,
}: BlockEscapeGameProps): React.JSX.Element {
  const [blocks, setBlocks] = useState<Block[]>(() =>
    cloneBlocks(INITIAL_BLOCKS)
  );
  const [message, setMessage] = useState("");
  const [solved, setSolved] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 });
  const [dragPosition, setDragPosition] = useState<Point | null>(null);

  const boardRef = useRef<HTMLDivElement | null>(null);

  const blocksById = useMemo(() => {
    return Object.fromEntries(blocks.map((block) => [block.id, block]));
  }, [blocks]);

  const boardWidth = COLS * CELL_SIZE + (COLS - 1) * GAP;
  const boardHeight = ROWS * CELL_SIZE + (ROWS - 1) * GAP;
  const outerWidth = boardWidth + BOARD_PADDING * 2;
  const outerHeight = boardHeight + BOARD_PADDING * 2 + EXIT_HEIGHT;
  const exitLeft = getPixelX(EXIT_COL);
  const exitWidth = EXIT_WIDTH * CELL_SIZE + (EXIT_WIDTH - 1) * GAP;

  function resetGame(): void {
    setBlocks(cloneBlocks(INITIAL_BLOCKS));
    setMessage("");
    setSolved(false);
    setDraggingId(null);
    setDragPosition(null);
  }

  function finishSolved(): void {
    if (solved) {
      return;
    }

    setSolved(true);
    setMessage("Riktig! Den røde klossen kom seg ut.");
    onSolved();
  }

  function moveBlock(blockId: string, nextX: number, nextY: number): void {
    setBlocks((prev) => {
      const next = prev.map((block) =>
        block.id === blockId ? { ...block, x: nextX, y: nextY } : block
      );

      const movedGoal = next.find((block) => block.id === "goal");
      if (movedGoal && movedGoal.x === EXIT_COL && movedGoal.y === -1) {
        window.setTimeout(() => finishSolved(), 220);
      }

      return next;
    });
  }

  function beginDrag(block: Block, clientX: number, clientY: number): void {
    if (solved || !boardRef.current) {
      return;
    }

    const availableMoves = getAvailableMoves(blocks, block);

    if (availableMoves.length === 0) {
      return;
    }

    if (availableMoves.length === 1) {
      moveBlock(block.id, availableMoves[0].x, availableMoves[0].y);
      setMessage("");
      return;
    }

    const boardRect = boardRef.current.getBoundingClientRect();

    setDraggingId(block.id);
    setDragOffset({
      x: clientX - boardRect.left - getPixelX(block.x),
      y: clientY - boardRect.top - getPixelY(block.y),
    });
    setDragPosition({
      x: getPixelX(block.x),
      y: getPixelY(block.y),
    });
    setMessage("");
  }

  function handlePointerMove(
    event: React.PointerEvent<HTMLButtonElement>
  ): void {
    if (!draggingId || !boardRef.current) {
      return;
    }

    const block = blocksById[draggingId];
    if (!block) {
      return;
    }

    const boardRect = boardRef.current.getBoundingClientRect();
    const rawX = event.clientX - boardRect.left - dragOffset.x;
    const rawY = event.clientY - boardRect.top - dragOffset.y;
    const limits = getMoveLimits(blocks, block);
    const minPixelX = getPixelX(limits.minX);
    const maxPixelX = getPixelX(limits.maxX);
    const minPixelY = getPixelY(limits.minY);
    const maxPixelY = getPixelY(limits.maxY);

    setDragPosition({
      x: clamp(rawX, minPixelX, maxPixelX),
      y: clamp(rawY, minPixelY, maxPixelY),
    });
  }

  function handlePointerEnd(): void {
    if (!draggingId) {
      return;
    }

    const block = blocksById[draggingId];

    if (!block || !dragPosition) {
      setDraggingId(null);
      setDragPosition(null);
      return;
    }

    const step = getCellStep();
    const limits = getMoveLimits(blocks, block);
    const snappedX = Math.round((dragPosition.x - BOARD_PADDING) / step);
    const snappedY = Math.round(
      (dragPosition.y - BOARD_PADDING - EXIT_HEIGHT) / step
    );
    const nextX = clamp(snappedX, limits.minX, limits.maxX);
    const nextY = clamp(snappedY, limits.minY, limits.maxY);

    setDraggingId(null);
    setDragPosition(null);

    if (!isSamePosition({ x: nextX, y: nextY }, { x: block.x, y: block.y })) {
      moveBlock(block.id, nextX, nextY);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-stone-700 md:max-w-[600px]">
        Få den røde klossen ut gjennom åpningen øverst til høyre. Alle klossene
        kan flyttes både vannrett og loddrett, men bare dit det faktisk er ledig
        plass. Trykk på en kloss når den bare har ett mulig trekk, eller dra den
        når du må velge retning.
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={resetGame}
          className="rounded bg-stone-900 px-4 py-2 text-white transition hover:bg-black"
        >
          Tilbakestill
        </button>

        {message && <p className="text-sm text-stone-700">{message}</p>}
      </div>

      <div className="overflow-x-auto">
        <div
          ref={boardRef}
          className="relative mx-auto w-fit"
          style={{
            width: `${outerWidth}px`,
            height: `${outerHeight}px`,
            touchAction: "none",
          }}
        >
          <div className="absolute inset-0 rounded-[32px] bg-[linear-gradient(145deg,#5a2e12,#3a1f0c)] shadow-[inset_0_4px_12px_rgba(0,0,0,0.6),0_8px_20px_rgba(0,0,0,0.4)]" />

          <div
            className="absolute rounded-[24px] bg-[linear-gradient(145deg,#6b3a18,#4a2610)] shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]"
            style={{
              left: `${BOARD_PADDING}px`,
              top: `${BOARD_PADDING + EXIT_HEIGHT}px`,
              width: `${boardWidth}px`,
              height: `${boardHeight}px`,
            }}
          >
            <div
              className="grid h-full w-full"
              style={{
                gridTemplateColumns: `repeat(${COLS}, ${CELL_SIZE}px)`,
                gridTemplateRows: `repeat(${ROWS}, ${CELL_SIZE}px)`,
                gap: `${GAP}px`,
              }}
            >
              {Array.from({ length: COLS * ROWS }).map((_, index) => (
                <div
                  key={`cell-${index}`}
                  className="rounded-xl border border-black/20 bg-black/10"
                />
              ))}
            </div>
          </div>

          <div
            className="absolute z-[1] bg-[#e7dfcc]"
            style={{
              left: `${exitLeft}px`,
              top: "0px",
              width: `${exitWidth}px`,
              height: `${BOARD_PADDING + EXIT_HEIGHT + 2}px`,
              borderBottomLeftRadius: "0px",
              borderBottomRightRadius: "0px",
            }}
          />

          {blocks.map((block) => {
            const isDragging = draggingId === block.id && dragPosition !== null;
            const left = isDragging ? dragPosition.x : getPixelX(block.x);
            const top = isDragging ? dragPosition.y : getPixelY(block.y);
            const isGoal = block.color === "goal";

            return (
              <button
                key={block.id}
                type="button"
                onPointerDown={(event) => {
                  event.preventDefault();
                  event.currentTarget.setPointerCapture(event.pointerId);
                  beginDrag(block, event.clientX, event.clientY);
                }}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerEnd}
                onPointerCancel={handlePointerEnd}
                className={[
                  "absolute select-none rounded-2xl border-2 shadow-sm",
                  "transition-[left,top,transform,box-shadow] duration-200 ease-out",
                  isDragging ? "z-20 scale-[1.02] shadow-lg" : "z-10",
                  isGoal
                    ? "border-red-900 bg-[linear-gradient(145deg,#d24a2f,#a8321d)] shadow-[inset_0_2px_6px_rgba(255,255,255,0.25)]"
                    : "border-[#caa56a] bg-[linear-gradient(145deg,#f2d29b,#d8a85c)] shadow-[inset_0_2px_6px_rgba(255,255,255,0.3)]",
                ].join(" ")}
                style={{
                  left: `${left}px`,
                  top: `${top}px`,
                  width: `${getBlockWidth(block)}px`,
                  height: `${getBlockHeight(block)}px`,
                  touchAction: "none",
                }}
                aria-label={isGoal ? "Yellow block" : `Blue block ${block.id}`}
              >
                <div
                  className={[
                    "absolute inset-[4px] rounded-xl",
                    isGoal ? "bg-white/10" : "bg-white/15",
                  ].join(" ")}
                />
                <div
                  className={[
                    "absolute inset-0 rounded-2xl",
                    isGoal
                      ? "shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]"
                      : "shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]",
                  ].join(" ")}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
