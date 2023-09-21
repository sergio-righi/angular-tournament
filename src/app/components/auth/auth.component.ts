import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "app/models/auth.service";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"],
})
export class AuthComponent implements OnInit {
  public username: string = "";
  public password: string = "";
  public message: string = "";
  isPasswordVisible: boolean = false;

  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit() { }

  get passwordType(): string {
    return this.isPasswordVisible ? "text" : "password";
  }

  togglePassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  async authenticate(form: NgForm) {
    if (form.valid) {
      const response = await this.auth.authenticate(this.username, this.password)
      if (response) {
        this.router.navigateByUrl(this.auth.redirectUrl || "");
      } else {
        this.message = 'Something went wrong';
      }
    } else {
      this.message = "Invalid Form Data"
    }
  }
}
