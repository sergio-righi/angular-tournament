import { Component, OnInit } from "@angular/core";

import { UserService, TournamentService } from "app/core";

@Component({
  selector: "app-layout-default",
  templateUrl: "./default.component.html"
})
export class DefaultComponent implements OnInit {
  constructor(private userService: UserService, private tournamentService: TournamentService) { }

  ngOnInit() {
    this.userService.populate();
  }
}
