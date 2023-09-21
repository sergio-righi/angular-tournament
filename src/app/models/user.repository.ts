import { Injectable } from "@angular/core";
import { RestService } from "./rest.service";
import { User } from "./user.model";
import { AuthService } from "./auth.service";

@Injectable()
export class UserRepository {
  private _users: User[] = [];
  isReady: boolean = false;

  constructor(private userApi: RestService, private authApi: AuthService) { }

  get users(): User[] {
    return this._users;
  }

  get getUser(): User {
    this.isReady = true;
    return this.authApi.session;
  }

  async saveUser(user: User) {
    const response = await this.userApi.updateUser(user);
    if (response && response.status === 200) {
      this.authApi.session = user;
    } else {
      console.log(`Error: Something went wrong`);
    }
  }

  async signup(user: User): Promise<User> {
    const response = await this.userApi.signup(user);
    const newSession = { ...user, id: response.payload }
    this.users.push(newSession);
    this.authApi.session = newSession;
    return newSession;
  }
}
