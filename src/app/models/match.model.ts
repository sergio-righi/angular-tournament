import { Game } from "./game.model";

export interface Match {
  p1: string;
  p2: string;
  won: string;
  lost: string;
  diff: number;
  games: Game[]
}