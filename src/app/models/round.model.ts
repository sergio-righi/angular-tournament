import { TournamentFormat } from "app/utils";
import { Match } from "./match.model";

export interface Round {
  id: string;
  index: number;
  format: TournamentFormat;
  matches: Match[];
}