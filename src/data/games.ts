import {
  Hamburger,
  Ear,
  Cigarette,
  CupSoda,
  PlugZap,
  TrainFront,
} from "lucide-react";
import { GameDefinition, GameProgress } from "../types/game";

export const GAMES: GameDefinition[] = [
  { id: "hamburger", title: "Burger", code: "BURGER", icon: Hamburger },
  { id: "ear", title: "Overhøre", code: "HULK", icon: Ear },
  { id: "cigarette", title: "Røyk", code: "SCHOOL", icon: Cigarette },
  { id: "cup", title: "Drikke", code: "STAR", icon: CupSoda },
  { id: "plug", title: "Elektrisitet", code: "BALL", icon: PlugZap },
  { id: "train", title: "Tog", code: "LEAF", icon: TrainFront },
];

export const DEFAULT_PROGRESS: GameProgress = {
  hamburger: { unlocked: false, completed: false },
  ear: { unlocked: false, completed: false },
  cigarette: { unlocked: false, completed: false },
  cup: { unlocked: false, completed: false },
  plug: { unlocked: false, completed: false },
  train: { unlocked: false, completed: false },
};

export const GAME_PROGRESS_KEY = "easter-game-progress";
