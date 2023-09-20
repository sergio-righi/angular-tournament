import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { UserService } from 'app/core';

@Injectable()
export class TournamentAuthResolver  {
  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {

    return this.userService.isAuthenticated.pipe(take(1));

  }
}
