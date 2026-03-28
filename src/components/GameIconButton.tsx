import React from "react";
import { CheckCircle2 } from "lucide-react";
import { GameDefinition, GameProgressItem } from "../types/game";

type Props = {
  game: GameDefinition;
  state: GameProgressItem;
  onClick: () => void;
};

export default function GameIconButton({
  game,
  state,
  onClick,
}: Props): React.JSX.Element {
  const Icon = game.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative flex h-14 w-14 items-center justify-center rounded-2xl border
        transition duration-200
        hover:scale-105 hover:bg-black/5
        ${
          state.completed
            ? "border-green-600 bg-green-100/70"
            : state.unlocked
            ? "border-stone-700 bg-stone-100/50"
            : "border-stone-700 bg-transparent"
        }
      `}
      aria-label={game.title}
    >
      <Icon
        size={48}
        className={`
          transition
          ${
            state.completed
              ? "text-green-700 opacity-70"
              : "text-black hover:text-stone-700"
          }
        `}
      />

      {state.completed && (
        <CheckCircle2
          size={24}
          className="absolute -right-1 -top-1 rounded-full bg-white text-green-600"
        />
      )}
    </button>
  );
}
