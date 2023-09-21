import { Participant } from "./participant.model";
import { Round } from "./round.model";

export class Tournament {
  static default = {
    id: "",
    name: "",
    description: "",
    participants: [],
    rounds: {} as Round,
    owner: "",
    startedAt: "",
    createdAt: Date.now(),
    completed: false,
    deleted: false
  }

  constructor(
    public id: string,
    public name: string,
    public description: string,
    public participants: Participant[],
    public rounds: Round,
    public startedAt: string,
    public owner: string,
    public createdAt: number = Date.now(),
    public completed: boolean = false,
    public deleted: boolean = false
  ) { }
}
