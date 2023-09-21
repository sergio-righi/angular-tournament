import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { User } from "app/models/user.model";
import { UserRepository } from "app/models/user.repository";

@Component({
  selector: "app-user-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  public user: User = {} as User;
  public message: string = "";
  isPasswordVisible: boolean = false;
  isEditing: boolean = false;

  constructor(public repository: UserRepository, private router: Router) {
  }

  ngOnInit(): void {
    this.user = this.repository.getUser;
  }

  get passwordType(): string {
    return this.isPasswordVisible ? "text" : "password";
  }

  togglePassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  toggleEditMode() {
    this.isEditing = !this.isEditing;
  }

  save(form: NgForm) {
    if (!this.user) return;
    this.repository.saveUser(this.user);
    this.router.navigateByUrl("/user/profile");
    this.toggleEditMode();
  }
}
