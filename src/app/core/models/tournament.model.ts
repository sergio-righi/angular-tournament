import { Participant } from "./participant.model";
import { Round } from "./round.model";

export interface Tournament {
  id: string;
  name: string;
  description?: string;
  participants: Array<Participant>;
  rounds: Round;
  createdBy: string;
  createdAt?: number;
  startDate?: number;
  deleted: boolean;
}
