import { Injectable } from '@angular/core';
import { ObjectID } from 'bson'

import { ApiService } from './api.service';
import { Tournament } from 'app/core/models';

import * as data from 'assets/data/tournament.json';

@Injectable()
export class TournamentService {

  tournaments: Array<Tournament> = [];

  constructor(
    private apiService: ApiService
  ) { }

  all(): Array<Tournament> {
    return this.tournaments;
  }

  findById(id: string): Tournament | undefined {
    return this.tournaments.find(tournament => tournament.id === id);
  }

  insert(tournament: Tournament): Tournament {
    tournament.id = new ObjectID().toString();
    this.tournaments.push(tournament);
    return tournament;
  }

  update(id: string, tournament: Tournament): Tournament {
    const index: number = this.tournaments.findIndex(tournament => tournament.id === id);
    if (index !== -1) {
      const persistentTournament = this.findById(id);
      this.tournaments[index] = { ...persistentTournament, ...tournament, id };
    }
    return tournament;
  }

  delete(id: string): boolean {
    const index: number = this.tournaments.findIndex(tournament => tournament.id === id);
    if (index !== -1) {
      this.tournaments.splice(index, 1);
      return true;
    }
    return false;
  }
}
