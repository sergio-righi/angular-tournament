import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { UserService } from 'app/core';

@Injectable()
export class ProfileAuthResolver {
  constructor(
    private router: Router,
    private userService: UserService
  ) { }
}
