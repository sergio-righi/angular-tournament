import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ManageTournamentComponent } from './manage-tournament.component';
import { ViewTournamentComponent } from './view-tournament.component';
import { TournamentAuthResolver } from './tournament-auth-resolver.service';
import { SharedModule } from 'app/shared';
import { TournamentRoutingModule } from './tournament-routing.module';

@NgModule({
  imports: [
    SharedModule,
    TournamentRoutingModule
  ],
  declarations: [
    ViewTournamentComponent,
    ManageTournamentComponent
  ],
  providers: [
    TournamentAuthResolver
  ]
})
export class TournamentModule { }
