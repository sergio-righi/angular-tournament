import { Injectable } from "@angular/core";
import { ResponseModel } from "./response.model";
import { RestService } from "./rest.service";
import { User } from "./user.model";

@Injectable()
export class AuthService {
  private _redirectUrl!: string | null;
  private sessionName: string = "tournament";

  constructor(private authApi: RestService) { }

  get session(): User {
    return this.sessionName in window.sessionStorage ? JSON.parse(window.sessionStorage[this.sessionName]) : {} as User;
  }

  set session(user: User) {
    window.sessionStorage[this.sessionName] = JSON.stringify(user);
  }

  get redirectUrl(): string | null {
    let result = this._redirectUrl;
    this._redirectUrl = null;
    return result;
  }

  set redirectUrl(url: string) {
    this._redirectUrl = url;
  }

  get authenticated(): boolean {
    return !["", 'null', null, undefined].includes(this.session.id);
  }

  async authenticate(username: string, password: string): Promise<User> {
    const response = await this.authApi.authenticate(username, password)
    if (response && response.status === 200) {
      this.session = response.payload;
      return response.payload;
    } else {
      console.log(`Error: Something went wrong`);
    }
    return {} as User;
  }

  clear() {
    this.session = {} as User;
  }
}
