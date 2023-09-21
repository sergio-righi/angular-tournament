import { Component, OnInit } from "@angular/core";
import { Tournament } from "app/models";
import { hasStarted } from "app/utils";
import { TournamentRepository } from "app/models/tournament.repository";
import { LocaleService } from "app/models/locale.service";

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.scss"],
})
export class IndexComponent implements OnInit {
  title: string;
  completed: boolean = false;

  constructor(private repository: TournamentRepository, public locale: LocaleService) {
    this.title = locale.t.title.home;
  }

  async ngOnInit() { }

  get isReady(): boolean {
    return this.repository.isReady;
  }

  get tournamentList(): Tournament[] {
    return this.repository.tournaments.filter(
      (t: Tournament) =>
        !t.deleted &&
        t.completed === this.completed &&
        t.startedAt !== null &&
        hasStarted(new Date(t.startedAt ?? ""))
    );
  }
}
