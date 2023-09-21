import { Injectable } from "@angular/core";
import { RestService } from "./rest.service";
import { User } from "./user.model";
import { AuthService } from "./auth.service";

@Injectable()
export class UserRepository {
  constructor(private userApi: RestService, private authApi: AuthService) { }

  get getUser(): User {
    return this.authApi.session;
  }

  async saveUser(user: User) {
    const response = await this.userApi.updateUser(user.id, user);
    if (response && response.status === 200) {
      this.authApi.session = response.payload;
    } else {
      console.log(`Error: Something went wrong`);
    }
  }

  async signup(user: User): Promise<User> {
    const response = await this.userApi.signup(user);
    this.authApi.session = response.payload;
    return response.payload;
  }
}
