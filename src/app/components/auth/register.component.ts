import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "app/models/auth.service";
import { User } from "app/models/user.model";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./auth.component.scss"],
})
export class RegisterComponent implements OnInit {
  public user: User = {} as User;
  public message: string = "";
  isPasswordVisible: boolean = false;

  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit(): void { }

  get passwordType(): string {
    return this.isPasswordVisible ? "text" : "password";
  }

  togglePassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  async signup(form: NgForm) {
    if (form.valid) {
      const response = await this.auth.signup(this.user)
      if (response) {
        this.router.navigateByUrl("auth/login");
      } else {
        this.message = 'Something went wrong';
      }
    } else {
      this.message = "Invalid Form Data"
    }
  }
}
