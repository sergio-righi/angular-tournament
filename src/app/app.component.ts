import { Component, OnInit } from "@angular/core";

import { UserService, TournamentService } from "./core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html"
})
export class AppComponent implements OnInit {
  constructor(private userService: UserService, private tournamentService: TournamentService) { }

  ngOnInit() {
    this.userService.populate();
  }
}
