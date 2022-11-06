import { Injectable } from '@angular/core';
import { ObjectID } from 'bson'

import { ApiService } from './api.service';
import { Tournament } from '../models';

@Injectable()
export class TournamentService {

  tournaments: Array<Tournament> = [
    {
      id: "6366b30c9b421bae55d18f3c",
      name: "Tournament 1",
      description: "",
      participants: [
        {
          id: "63627c815db2569f1b044daf",
          name: "Participant 1"
        },
        {
          id: "63627c815db2569f1b044db0",
          name: "Participant 2"
        },
        {
          id: "63627c815db2569f1b044db1",
          name: "Participant 3"
        },
        {
          id: "63627c815db2569f1b044db2",
          name: "Participant 4"
        },
        {
          id: "63627c815db2569f1b044db3",
          name: "Participant 5"
        },
        {
          id: "63627c815db2569f1b044db4",
          name: "Participant 6"
        },
        {
          id: "63627c815db2569f1b044db5",
          name: "Participant 7"
        },
        {
          id: "63627c815db2569f1b044db6",
          name: "Participant 8"
        },
        {
          id: "63627c815db2569f1b044db7",
          name: "Participant 9"
        },
        {
          id: "63627c815db2569f1b044db8",
          name: "Participant 10"
        },
        {
          id: "63627c815db2569f1b044db9",
          name: "Participant 11"
        },
        {
          id: "63627c815db2569f1b044dba",
          name: "Participant 12"
        },
        {
          id: "63627c815db2569f1b044dbb",
          name: "Participant 13"
        },
        {
          id: "63627c815db2569f1b044dbc",
          name: "Participant 14"
        },
        {
          id: "63627c815db2569f1b044dbd",
          name: "Participant 15"
        },
        {
          id: "63627c815db2569f1b044dbe",
          name: "Participant 16"
        }
      ],
      rounds: {
        r16: [
          {
            x: "63627c815db2569f1b044daf",
            y: "63627c815db2569f1b044db0",
            winner: -1,
          },
          {
            x: "63627c815db2569f1b044db1",
            y: "63627c815db2569f1b044db2",
            winner: -1,
          },
          {
            x: "63627c815db2569f1b044db3",
            y: "63627c815db2569f1b044db4",
            winner: -1,
          },
          {
            x: "63627c815db2569f1b044db5",
            y: "63627c815db2569f1b044db6",
            winner: -1,
          },
          {
            x: "63627c815db2569f1b044db7",
            y: "63627c815db2569f1b044db8",
            winner: -1,
          },
          {
            x: "63627c815db2569f1b044db9",
            y: "63627c815db2569f1b044dba",
            winner: -1,
          },
          {
            x: "63627c815db2569f1b044dbb",
            y: "63627c815db2569f1b044dbc",
            winner: -1,
          },
          {
            x: "63627c815db2569f1b044dbd",
            y: "63627c815db2569f1b044dbe",
            winner: -1,
          },
        ],
        r8: [
          {
            x: "",
            y: "",
            winner: -1,
          },
          {
            x: "",
            y: "",
            winner: -1,
          },
          {
            x: "",
            y: "",
            winner: -1,
          },
          {
            x: "",
            y: "",
            winner: -1,
          },
        ],
        r4: [
          {
            x: "",
            y: "",
            winner: -1,
          },
          {
            x: "",
            y: "",
            winner: -1,
          },
        ],
        r2: [
          {
            x: "",
            y: "",
            winner: -1,
          },
        ],
      },
      startDate: 1667678559544,
      createdAt: 1667678539544,
      createdBy: "63627d5b1b0ad31a2af90f30",
      deleted: false
    }
  ];

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