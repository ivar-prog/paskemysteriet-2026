import { Brain, Hamburger, School, Star, Volleyball, Leaf } from "lucide-react";
import { GameDefinition, GameProgress } from "../types/game";

export const GAMES: GameDefinition[] = [
  { id: "brain", title: "Brain", code: "HULK", icon: Brain },
  { id: "hamburger", title: "Hamburger", code: "BURGER", icon: Hamburger },
  { id: "school", title: "School", code: "SCHOOL", icon: School },
  { id: "star", title: "Star", code: "STAR", icon: Star },
  { id: "volleyball", title: "Volleyball", code: "BALL", icon: Volleyball },
  { id: "leaf", title: "Leaf", code: "LEAF", icon: Leaf },
];

export const DEFAULT_PROGRESS: GameProgress = {
  brain: { unlocked: false, completed: false },
  hamburger: { unlocked: false, completed: false },
  school: { unlocked: false, completed: false },
  star: { unlocked: false, completed: false },
  volleyball: { unlocked: false, completed: false },
  leaf: { unlocked: false, completed: false },
};

export const GAME_PROGRESS_KEY = "easter-game-progress";
