import { LucideIcon } from "lucide-react";

export type GameId =
  | "brain"
  | "hamburger"
  | "school"
  | "star"
  | "volleyball"
  | "leaf";

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
