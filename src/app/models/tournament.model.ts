import { Match } from "./match.model";
import { Participant } from "./participant.model";
import { TournamentMode } from "app/utils";
import { Round } from "./round.model";

export class Tournament {
  static default = {
    id: "",
    name: "",
    mode: TournamentMode.Knockout,
    description: "",
    participants: [],
    rounds: [],
    owner: "",
    startedAt: "",
    createdAt: Date.now(),
    completed: false,
    deleted: false
  }

  constructor(
    public id: string,
    public name: string,
    public mode: TournamentMode,
    public description: string,
    public participants: Participant[],
    public rounds: Round[],
    public startedAt: string,
    public owner: string,
    public createdAt: number = Date.now(),
    public completed: boolean = false,
    public deleted: boolean = false
  ) { }
}
