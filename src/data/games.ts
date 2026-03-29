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
  { id: "hamburger", title: "Burger", code: "HULK", icon: Hamburger },
  { id: "ear", title: "Overhøre", code: "HÅNDKLE", icon: Ear },
  { id: "cigarette", title: "Røyk", code: "RABALDER", icon: Cigarette },
  { id: "cup", title: "Drikke", code: "PARACHUTES", icon: CupSoda },
  { id: "plug", title: "Elektrisitet", code: "BAMSE", icon: PlugZap },
  { id: "train", title: "Tog", code: "BERKELIUM", icon: TrainFront },
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
