import { TournamentFormat } from "app/utils";
import { Game } from "./game.model";

export interface Match {
  p1: string;
  p2: string;
  format: TournamentFormat;
  games: Game[]
  won: string;
  lost: string;
  diff: number;
}