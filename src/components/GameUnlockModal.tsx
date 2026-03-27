import React, { useState } from "react";
import { GameDefinition } from "../types/game";

type Props = {
  game: GameDefinition | null;
  isUnlocked: boolean;
  onClose: () => void;
  onUnlock: (id: GameDefinition["id"]) => void;
  onComplete: (id: GameDefinition["id"]) => void;
};

export default function GameUnlockModal({
  game,
  isUnlocked,
  onClose,
  onUnlock,
  onComplete,
}: Props): React.JSX.Element | null {
  const [value, setValue] = useState("");
  const [feedback, setFeedback] = useState("");

  if (!game) return null;

  function handleUnlock() {
    if (value.trim().toUpperCase() !== game?.code.toUpperCase()) {
      setFeedback("Not quite right yet. Try again.");
      return;
    }

    onUnlock(game.id);
    setFeedback("Unlocked!");
    setValue("");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-2xl bg-[#f4ead2] p-6 text-black shadow-2xl">
        <h2 className="mb-2 text-2xl font-semibold">{game.title}</h2>

        {!isUnlocked ? (
          <>
            <p className="mb-4 text-sm text-stone-700">
              Enter the password to unlock this game.
            </p>

            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full rounded-lg border border-stone-400 bg-white px-3 py-2"
              placeholder="Enter code"
            />

            <button
              type="button"
              onClick={handleUnlock}
              className="mt-3 rounded-lg bg-stone-900 px-4 py-2 text-white transition hover:bg-black"
            >
              Unlock
            </button>

            {feedback && <p className="mt-3 text-sm">{feedback}</p>}
          </>
        ) : (
          <>
            <p className="mb-4 text-stone-700">
              This is where the actual game will go.
            </p>

            <button
              type="button"
              onClick={() => onComplete(game.id)}
              className="rounded-lg bg-green-700 px-4 py-2 text-white transition hover:bg-green-800"
            >
              Mark game as completed
            </button>
          </>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-4 text-sm underline"
        >
          Close
        </button>
      </div>
    </div>
  );
}
