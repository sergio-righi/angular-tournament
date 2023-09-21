import { Injectable } from "@angular/core";
import { RestService } from "./rest.service";
import { Tournament } from "./tournament.model";

@Injectable()
export class TournamentRepository {
  private tournaments: Tournament[] = [];
  isReady: boolean = false;

  constructor(private tournamentApi: RestService) { }

  getTournaments(): Tournament[] {
    return this.tournaments;
  }

  async setTournaments() {
    this.isReady = false;
    const response = await this.tournamentApi.getTournamentList();
    this.tournaments = response.payload
    this.isReady = true;
  }

  getItem(id: string): Tournament {
    return { ...this.tournaments.find((item: Tournament) => item.id === id)! };
  }

  async saveTournament(tournament: Tournament) {
    if (tournament.id === null || tournament.id === "" || tournament.id === undefined) {
      const response = await this.tournamentApi.insertTournament(tournament);
      console.log(response);
      if (response && response.status === 200) {
        this.tournaments.push({ ...tournament, id: response.payload });
        console.log(this.tournaments);
      } else {
        console.log(`Error: Something went wrong`);
      }
    } else {
      const response = await this.tournamentApi.updateTournament(tournament);
      if (response && response.status === 200) {
        this.tournaments.splice(
          this.tournaments.findIndex((item: Tournament) => item.id === tournament.id),
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
      this.tournaments.splice(
        this.tournaments.findIndex((item: Tournament) => item.id === id),
        1
      );
    } else {
      console.log(`Error: Something went wrong`);
    }
  }
}
