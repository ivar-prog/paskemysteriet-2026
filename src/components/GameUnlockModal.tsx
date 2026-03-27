import React, { useState } from "react";
import { GameDefinition } from "../types/game";
import SudokuGame from "./games/SudokuGame";
import NonogramGame from "./games/NonogramGame";
import ColorConnectionsGame from "./games/ColorConnectionsGame";

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
      setFeedback("Dessverre ikke riktig. Har du løst alle gåtene?");
      return;
    }

    onUnlock(game.id);
    setFeedback("Unlocked!");
    setValue("");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-fit rounded-2xl bg-[#f4ead2] p-6 text-black shadow-2xl relative">
        <button
          type="button"
          onClick={() => {
            onClose();
            setFeedback("");
            setValue("");
          }}
          className="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-lg text-white transition hover:bg-red-600"
          aria-label="Close"
        >
          ✕
        </button>
        <h2 className="mb-2 text-2xl font-semibold">{game.title}</h2>

        {!isUnlocked ? (
          <>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full rounded-lg border border-stone-400 bg-white px-3 py-2"
              placeholder="Skriv inn koden.."
            />

            <button
              type="button"
              onClick={handleUnlock}
              className="mt-3 rounded-lg bg-stone-900 px-4 py-2 text-white transition hover:bg-black"
            >
              Lås opp
            </button>

            {feedback && <p className="mt-3 text-sm">{feedback}</p>}
          </>
        ) : (
          <>
            {game.id === "hamburger" ? (
              <SudokuGame onSolved={() => onComplete(game.id)} />
            ) : game.id === "ear" ? (
              <NonogramGame onSolved={() => onComplete(game.id)} />
            ) : game.id === "plug" ? (
              <ColorConnectionsGame onSolved={() => onComplete(game.id)} />
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
          </>
        )}
      </div>
    </div>
  );
}
