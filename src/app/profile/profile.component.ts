import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'app/core/models';
import { UserService } from 'app/core/services';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userId!: string;
  isSubmitted: boolean = false;
  manageProfileForm: ProfileForm = new ProfileForm();

  @ViewChild("ProfileForm")
  profileForm!: NgForm;

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) {
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id'];
    this.findUser();
  }

  findUser(): void {
    // const user: User | undefined = this.userService.findById(this.userId);
    // if (user) {
    //   this.manageProfileForm.id = user.id;
    //   this.manageProfileForm.email = user.email;
    //   this.manageProfileForm.username = user.username;
    //   this.manageProfileForm.token = user.token;
    //   this.manageProfileForm.image = user.image;
    //   this.manageProfileForm.bio = user.bio;
    //   this.manageProfileForm.password = user.password;
    // }
  }

  saveUser(isValid: boolean) {
    this.isSubmitted = true;
    if (isValid) {
      // this.userService.update(this.manageProfileForm);
      this.router.navigate(['profile']);
    }
  }
}

export class ProfileForm implements User {
  id: string = "";
  name: string = "";
  email: string = "";
  token: string = "";
  username: string = "";
  bio: string = "";
  password: string = "";
}