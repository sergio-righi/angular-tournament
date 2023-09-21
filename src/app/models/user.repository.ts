import { Injectable } from "@angular/core";
import { RestService } from "./rest.service";
import { User } from "./user.model";
import { AuthService } from "./auth.service";

@Injectable()
export class UserRepository {
  isReady: boolean = false;

  constructor(private userApi: RestService, private authApi: AuthService) { }

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
}
