import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "app/models/auth.service";
import { LocaleService } from "app/models/locale.service";
import { User } from "app/models/user.model";
import { UserRepository } from "app/models/user.repository";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./auth.component.scss"],
})
export class RegisterComponent implements OnInit {
  public message: string = "";
  public user: User = User.default;
  isPasswordVisible: boolean = false;

  constructor(private router: Router, private repository: UserRepository, public locale: LocaleService) { }

  ngOnInit(): void { }

  get passwordType(): string {
    return this.isPasswordVisible ? "text" : "password";
  }

  togglePassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  async signup(form: NgForm) {
    if (form.valid) {
      const response = await this.repository.signup(this.user)
      if (response) {
        this.router.navigateByUrl("auth/login");
      } else {
        this.message = this.locale.t.message.request_error;
      }
    } else {
      this.message = this.locale.t.message.invalid_data;
    }
  }
}
