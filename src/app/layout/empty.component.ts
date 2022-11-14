import { Component, OnInit } from "@angular/core";

import { UserService, TournamentService } from "../core";

@Component({
  selector: "app-layout-empty",
  templateUrl: "./empty.component.html"
})
export class EmptyComponent implements OnInit {
  constructor(private userService: UserService, private tournamentService: TournamentService) { }

  ngOnInit() {
    this.userService.populate();
  }
}
