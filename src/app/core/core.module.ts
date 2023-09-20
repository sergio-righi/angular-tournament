import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  ApiService,
  AuthGuard,
  UserService,
  TournamentService
} from './services';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    ApiService,
    AuthGuard,
    UserService,
    TournamentService
  ],
  declarations: []
})
export class CoreModule { }
