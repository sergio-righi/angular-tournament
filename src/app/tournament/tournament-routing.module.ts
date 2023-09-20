import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewTournamentComponent } from './view-tournament.component';
import { ManageTournamentComponent } from './manage-tournament.component';
import { TournamentAuthResolver } from './tournament-auth-resolver.service';

const routes: Routes = [
  {
    path: 'manage/:id',
    component: ManageTournamentComponent,
    resolve: {
      // isAuthenticated: TournamentAuthResolver
    }
  },
  {
    path: 'manage',
    component: ManageTournamentComponent,
    resolve: {
      // isAuthenticated: TournamentAuthResolver
    }
  },
  {
    path: 'view/:id',
    component: ViewTournamentComponent,
    resolve: {
      // isAuthenticated: TournamentAuthResolver
    }
  },
  {
    path: 'view',
    component: ViewTournamentComponent,
    resolve: {
      // isAuthenticated: TournamentAuthResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TournamentRoutingModule { }
