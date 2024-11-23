import { Game } from "./game.model";

export interface Standings {
  name: string;
  diff: number;
  wins: number;
  losses: number;
  buchholz: number;
  opponents: string[];
}