import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiService } from './api.service';
import { User } from "app/core/models";


@Injectable()
export class UserService {

  constructor(
    private apiService: ApiService,
    private http: HttpClient
  ) { }

  // Verify JWT in localstorage with server & load user's info.
  // This runs once on application startup.
  populate() {
  }

  setAuth(user: User) {

  }

  attemptAuth(type: any, credentials: any): User {
    return {} as User;
  }

  getCurrentUser(): User {
    return {} as User;
  }

  // Update the user on the server (email, pass, etc)
  update(user: User): User {
    return {} as User;

  }
}
