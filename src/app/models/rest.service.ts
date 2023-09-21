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
  baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = "";
  }

  async getTournamentList(): Promise<ResponseModel<Tournament[]>> {
    return await asyncMethod(() => ({
      status: 200, payload: TournamentData
    }));
  }

  async insertTournament(tournament: Tournament): Promise<ResponseModel<string>> {
    return await asyncMethod(() => ({
      status: 200, payload: Date.now().toString()
    }));
  }

  async updateTournament(tournament: Tournament): Promise<ResponseModel<boolean>> {
    return await asyncMethod(() => ({
      status: 200, payload: true
    }));
  }

  async deleteTournament(id: string): Promise<ResponseModel<boolean>> {
    return await asyncMethod(() => ({
      status: 200, payload: true
    }));
  }

  async authenticate(username: string, password: string): Promise<ResponseModel<User>> {
    return await asyncMethod(() => ({
      status: 200, payload: UserData.find((user: User) => user.username === username && user.password === password)
    }));
  }

  async signup(user: User): Promise<ResponseModel<string>> {
    return await asyncMethod(() => ({
      status: 200, payload: Date.now().toString()
    }));
  }

  async getUser(): Promise<ResponseModel<User>> {
    return await asyncMethod(() => ({
      status: 200, payload: {} as User
    }));
  }

  async updateUser(user: User): Promise<ResponseModel<boolean>> {
    return await asyncMethod(() => ({
      status: 200, payload: true
    }));
  }
}
