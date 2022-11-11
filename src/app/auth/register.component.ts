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
  manageProfileForm: RegisterForm = new RegisterForm();

  @ViewChild("RegisterForm")
  profileForm!: NgForm;

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) {
  }

  ngOnInit(): void {}

  saveUser(isValid: boolean) {
    this.isSubmitted = true;
    if (isValid) {
      this.router.navigate(['']);
    }
  }
}

export class RegisterForm implements User {
  id: string = "";
  email: string = "";
  token: string = "";
  username: string = "";
  bio: string = "";
  password: string = "";
}