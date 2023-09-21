import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { SharedModule } from 'app/components/shared';
import { TournamentModule } from "app/components/tournament/tournament.module";
import { IndexComponent } from "./index.component";

@NgModule({
  imports: [BrowserModule, FormsModule, RouterModule, SharedModule, TournamentModule],
  declarations: [IndexComponent],
  exports: [IndexComponent],
})
export class IndexModule { }
