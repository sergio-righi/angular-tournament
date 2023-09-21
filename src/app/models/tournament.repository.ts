import { Injectable } from "@angular/core";
import { RestService } from "./rest.service";
import { Tournament } from "./tournament.model";

@Injectable()
export class TournamentRepository {
  constructor(private tournamentApi: RestService) { }

  async tournaments(): Promise<Tournament[]> {
    const response = await this.tournamentApi.getTournamentList();
    return response.payload;
  }

  async findTournament(id: string): Promise<Tournament> {
    const response = await this.tournamentApi.findTournament(id);
    return response.payload;
  }

  async saveTournament(tournament: Tournament): Promise<Tournament | null> {
    if (tournament.id === null || tournament.id === "" || tournament.id === undefined) {
      const response = await this.tournamentApi.insertTournament(tournament);
      if (response && response.status === 200) {
        return response.payload;
      } else {
        console.log(`Error: Something went wrong`);
      }
    } else {
      const response = await this.tournamentApi.updateTournament(tournament.id, tournament);
      if (response && response.status === 200) {
        return tournament;
      } else {
        console.log(`Error: Something went wrong`);
      }
    }
    return null;
  }

  async deleteTournament(id: string): Promise<boolean> {
    const response = await this.tournamentApi.deleteTournament(id);
    if (response && response.status === 200) {
      return response.payload;
    } else {
      console.log(`Error: Something went wrong`);
    }
    return false;
  }
}
