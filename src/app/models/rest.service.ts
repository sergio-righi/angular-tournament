import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Tournament } from "./tournament.model";
import { ResponseModel } from "./response.model";
import { User } from "./user.model";
import { asyncMethod } from "app/utils";

// data
import TournamentData from "assets/data/tournament.json";
import UserData from "assets/data/user.json";

@Injectable()
export class RestService {
  private _users: User[] = UserData;
  private _tournaments: Tournament[] = TournamentData;

  async authenticate(username: string, password: string): Promise<ResponseModel<User>> {
    return await asyncMethod(() => ({
      status: 200, payload: this._users.find((user: User) => user.username === username && user.password === password)
    }));
  }

  async getTournamentList(): Promise<ResponseModel<Tournament[]>> {
    return await asyncMethod(() => ({
      status: 200, payload: this._tournaments
    }));
  }

  async findTournament(id: string): Promise<ResponseModel<Tournament>> {
    return await asyncMethod(() => ({
      status: 200, payload: this._tournaments.find((item: Tournament) => item.id === id)
    }));
  }

  async insertTournament(tournament: Tournament): Promise<ResponseModel<Tournament>> {
    const tournamentId = Date.now().toString();
    const newTournament = { ...tournament, id: tournamentId };
    this._tournaments.push(newTournament);

    return await asyncMethod(() => ({
      status: 200, payload: newTournament
    }));
  }

  async updateTournament(id: string, tournament: Tournament): Promise<ResponseModel<Tournament>> {
    const index = this._tournaments.findIndex((item: Tournament) => item.id === id);
    const newTournament = { ...this._tournaments[index], ...tournament };
    this._tournaments[index] = newTournament;

    return await asyncMethod(() => ({
      status: 200, payload: newTournament
    }));
  }

  async deleteTournament(id: string): Promise<ResponseModel<boolean>> {
    this._tournaments = this._tournaments.filter((item: Tournament) => item.id !== id);
    return await asyncMethod(() => ({
      status: 200, payload: true
    }));
  }

  async getUserList(): Promise<ResponseModel<User[]>> {
    return await asyncMethod(() => ({
      status: 200, payload: this._users
    }));
  }

  async signup(user: User): Promise<ResponseModel<User>> {
    const userId = Date.now().toString();
    const newUser = { ...user, id: userId };
    this._users.push(newUser);

    return await asyncMethod(() => ({
      status: 200, payload: newUser
    }));
  }

  async updateUser(id: string, user: User): Promise<ResponseModel<User>> {
    const index = this._users.findIndex((item: User) => item.id === id);
    const newUser = { ...this._users[index], ...user };
    this._users[index] = newUser;

    return await asyncMethod(() => ({
      status: 200, payload: newUser
    }));
  }
}
