import { Injectable } from "@angular/core";
import { RestService } from "./rest.service";
import { Tournament } from "./tournament.model";

@Injectable()
export class TournamentRepository {
  private _tournaments: Tournament[] = [];
  isReady: boolean = false;

  constructor(private tournamentApi: RestService) { }

  get tournaments(): Tournament[] {
    return this._tournaments;
  }

  getItem(id: string): Tournament {
    return { ...this._tournaments.find((item: Tournament) => item.id === id)! };
  }

  async saveTournament(tournament: Tournament) {
    if (tournament.id === null || tournament.id === "" || tournament.id === undefined) {
      const response = await this.tournamentApi.insertTournament(tournament);
      if (response && response.status === 200) {
        this._tournaments.push({ ...tournament, id: response.payload });
      } else {
        console.log(`Error: Something went wrong`);
      }
    } else {
      const response = await this.tournamentApi.updateTournament(tournament);
      if (response && response.status === 200) {
        this._tournaments.splice(
          this._tournaments.findIndex((item: Tournament) => item.id === tournament.id),
          1,
          tournament
        );
      } else {
        console.log(`Error: Something went wrong`);
      }
    }
  }

  async deleteTournament(id: string) {
    const response = await this.tournamentApi.deleteTournament(id);
    if (response && response.status === 200) {
      const index = this._tournaments.findIndex((item: Tournament) => item.id === id);
      this._tournaments.splice(index, 1);
    } else {
      console.log(`Error: Something went wrong`);
    }
  }
}
