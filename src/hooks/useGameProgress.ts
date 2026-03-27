import { useEffect, useMemo, useState } from "react";
import { DEFAULT_PROGRESS, GAME_PROGRESS_KEY } from "../data/games";
import { GameId, GameProgress } from "../types/game";

function loadProgress(): GameProgress {
  try {
    const raw = localStorage.getItem(GAME_PROGRESS_KEY);
    if (!raw) return DEFAULT_PROGRESS;

    return {
      ...DEFAULT_PROGRESS,
      ...JSON.parse(raw),
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function useGameProgress() {
  const [progress, setProgress] = useState<GameProgress>(() => loadProgress());

  useEffect(() => {
    localStorage.setItem(GAME_PROGRESS_KEY, JSON.stringify(progress));
  }, [progress]);

  function unlockGame(id: GameId) {
    setProgress((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        unlocked: true,
      },
    }));
  }

  function completeGame(id: GameId) {
    setProgress((prev) => ({
      ...prev,
      [id]: {
        unlocked: true,
        completed: true,
      },
    }));
  }

  function resetProgress() {
    setProgress(DEFAULT_PROGRESS);
    localStorage.removeItem(GAME_PROGRESS_KEY);
  }

  const completedCount = useMemo(
    () => Object.values(progress).filter((item) => item.completed).length,
    [progress]
  );

  function completeAllGames() {
    setProgress({
      hamburger: { unlocked: true, completed: true },
      ear: { unlocked: true, completed: true },
      cigarette: { unlocked: true, completed: true },
      cup: { unlocked: true, completed: true },
      plug: { unlocked: true, completed: true },
      train: { unlocked: true, completed: true },
    });
  }

  return {
    progress,
    unlockGame,
    completeGame,
    resetProgress,
    completedCount,
    completeAllGames,
  };
}
