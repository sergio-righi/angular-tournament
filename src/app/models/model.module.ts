import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AuthService } from "./auth.service";
import { RestService } from "./rest.service";
import { LocaleService } from "./locale.service";
import { TournamentRepository } from "./tournament.repository";
import { UserRepository } from "./user.repository";

@NgModule({
  imports: [
    HttpClientModule,
  ],
  providers: [AuthService, RestService, LocaleService, TournamentRepository, UserRepository],
})
export class ModelModule { }
