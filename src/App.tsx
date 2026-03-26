import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "easter_hunt_progress_v1" as const;

type LevelId = "rabbit" | "egg" | "forest" | "key" | "star" | "moon";

type Level = {
  id: LevelId;
  title: string;
  image: string;
  code: string;
};

type LevelProgress = {
  unlocked: boolean;
  completed: boolean;
};

type Progress = {
  introOpened: boolean;
  levels: Record<LevelId, LevelProgress>;
};

const LEVELS: readonly Level[] = [
  { id: "rabbit", title: "The Rabbit", image: "🐰", code: "RABBIT" },
  { id: "egg", title: "The Egg", image: "🥚", code: "EGG" },
  { id: "forest", title: "The Forest", image: "🌲", code: "FOREST" },
  { id: "key", title: "The Key", image: "🗝️", code: "KEY" },
  { id: "star", title: "The Star", image: "⭐", code: "STAR" },
  { id: "moon", title: "The Moon", image: "🌙", code: "MOON" },
] as const;

const defaultProgress: Progress = {
  introOpened: false,
  levels: {
    rabbit: { unlocked: false, completed: false },
    egg: { unlocked: false, completed: false },
    forest: { unlocked: false, completed: false },
    key: { unlocked: false, completed: false },
    star: { unlocked: false, completed: false },
    moon: { unlocked: false, completed: false },
  },
};

function isLevelId(value: string): value is LevelId {
  return LEVELS.some((level) => level.id === value);
}

function isLevelProgress(value: unknown): value is LevelProgress {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<LevelProgress>;
  return (
    typeof candidate.unlocked === "boolean" &&
    typeof candidate.completed === "boolean"
  );
}

function loadProgress(): Progress {
  if (typeof window === "undefined") return defaultProgress;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return defaultProgress;

    const parsedObject = parsed as Partial<Progress> & {
      levels?: Record<string, unknown>;
    };
    const nextLevels: Record<LevelId, LevelProgress> = {
      ...defaultProgress.levels,
    };

    if (parsedObject.levels) {
      for (const [key, value] of Object.entries(parsedObject.levels)) {
        if (isLevelId(key) && isLevelProgress(value)) {
          nextLevels[key] = value;
        }
      }
    }

    return {
      introOpened:
        typeof parsedObject.introOpened === "boolean"
          ? parsedObject.introOpened
          : false,
      levels: nextLevels,
    };
  } catch {
    return defaultProgress;
  }
}

export default function App(): React.JSX.Element {
  const [progress, setProgress] = useState<Progress>(defaultProgress);
  const [started, setStarted] = useState<boolean>(false);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [enteredCode, setEnteredCode] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    const savedProgress = loadProgress();
    setProgress(savedProgress);
    setStarted(savedProgress.introOpened);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [progress]);

  const completedCount = useMemo<number>(() => {
    return Object.values(progress.levels).filter((level) => level.completed)
      .length;
  }, [progress]);

  const allCompleted = completedCount === LEVELS.length;

  function handleStart(): void {
    setStarted(true);
    setProgress((prev) => ({
      ...prev,
      introOpened: true,
    }));
  }

  function unlockLevel(): void {
    if (!selectedLevel) return;

    if (enteredCode.trim().toUpperCase() !== selectedLevel.code) {
      setFeedback("Not quite right. Try again.");
      return;
    }

    setProgress((prev) => ({
      ...prev,
      levels: {
        ...prev.levels,
        [selectedLevel.id]: {
          ...prev.levels[selectedLevel.id],
          unlocked: true,
        },
      },
    }));

    setFeedback("Unlocked!");
    setEnteredCode("");
  }

  function markCompleted(id: LevelId): void {
    setProgress((prev) => ({
      ...prev,
      levels: {
        ...prev.levels,
        [id]: { unlocked: true, completed: true },
      },
    }));
  }

  function closeModal(): void {
    setSelectedLevel(null);
    setEnteredCode("");
    setFeedback("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#10231d] to-[#0f1d19] p-6 text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Påskemysteriet</h1>
        <p className="text-gray-300">Solve all 6 levels to unlock the final.</p>
        <p className="mt-2 text-sm">Progress: {completedCount}/6</p>
      </div>

      {!started && (
        <button
          type="button"
          onClick={handleStart}
          className="w-full cursor-pointer rounded-2xl border bg-yellow-100/10 p-10 text-center"
        >
          <div className="mb-4 text-6xl">📜</div>
          <h2 className="text-xl">Click to open the scroll</h2>
        </button>
      )}

      {started && (
        <div className="mb-8 rounded-2xl border bg-yellow-100 p-6 text-black">
          <p>
            The Easter Bunny has lost control of the eggs. Solve all paths to
            reveal the final location.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {LEVELS.map((level) => {
          const state = progress.levels[level.id];

          return (
            <button
              type="button"
              key={level.id}
              onClick={() => {
                setSelectedLevel(level);
                setFeedback("");
              }}
              className="rounded-2xl border bg-black/30 p-4 text-left hover:bg-black/50"
            >
              <div className="text-4xl">{level.image}</div>
              <div>{level.title}</div>
              <div className="text-sm">
                {state.completed
                  ? "✅ Completed"
                  : state.unlocked
                  ? "🔓 Unlocked"
                  : "🔒 Locked"}
              </div>
            </button>
          );
        })}
      </div>

      {selectedLevel && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70">
          <div className="w-96 rounded-2xl bg-gray-900 p-6">
            <h2 className="mb-4 text-xl">{selectedLevel.title}</h2>

            {!progress.levels[selectedLevel.id].unlocked ? (
              <>
                <input
                  className="w-full rounded p-2 text-black"
                  value={enteredCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEnteredCode(e.target.value)
                  }
                  placeholder="Enter code"
                />
                <button
                  type="button"
                  onClick={unlockLevel}
                  className="mt-2 rounded bg-green-500 px-4 py-2"
                >
                  Unlock
                </button>
                <p className="mt-2 text-sm">{feedback}</p>
              </>
            ) : (
              <>
                <p>This is where your game goes.</p>
                <button
                  type="button"
                  onClick={() => markCompleted(selectedLevel.id)}
                  className="mt-4 rounded bg-blue-500 px-4 py-2"
                >
                  Mark complete
                </button>
              </>
            )}

            <button
              type="button"
              onClick={closeModal}
              className="mt-4 text-sm underline"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {allCompleted && (
        <div className="mt-8 rounded-2xl border bg-green-500 p-6 text-black">
          <h2 className="text-xl">Final Unlocked!</h2>
          <button
            type="button"
            className="mt-2 rounded bg-black px-4 py-2 text-white"
          >
            Go to Final
          </button>
        </div>
      )}
    </div>
  );
}
