import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../core/models';
import { UserService } from '../core/services';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./auth.component.scss']
})
export class RegisterComponent implements OnInit {
  isSubmitted: boolean = false;
  isPasswordVisible: boolean = false;
  manageUserForm: RegisterForm = new RegisterForm();

  @ViewChild("RegisterForm")
  userForm!: NgForm;

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) {
  }

  ngOnInit(): void { }

  get passwordType(): string {
    return this.isPasswordVisible ? 'text' : 'password';
  }

  saveUser(isValid: boolean) {
    this.isSubmitted = true;
    if (isValid) {
      this.router.navigate(['']);
    }
  }

  togglePassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}

export class RegisterForm implements User {
  id: string = "";
  name: string = "";
  email: string = "";
  token: string = "";
  username: string = "";
  bio: string = "";
  password: string = "";
}