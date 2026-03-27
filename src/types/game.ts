import { LucideIcon } from "lucide-react";

export type GameId =
  | "hamburger"
  | "ear"
  | "cigarette"
  | "cup"
  | "plug"
  | "train";

export type GameDefinition = {
  id: GameId;
  title: string;
  code: string;
  icon: LucideIcon;
};

export type GameProgressItem = {
  unlocked: boolean;
  completed: boolean;
};

export type GameProgress = Record<GameId, GameProgressItem>;
