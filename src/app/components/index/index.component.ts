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
  tournaments: Tournament[] | null = null;

  constructor(private repository: TournamentRepository, public locale: LocaleService) {
    this.title = locale.t.title.home;
  }

  async ngOnInit() {
    const response = await this.repository.tournaments();
    this.tournaments = response;
  }

  get isReady(): boolean {
    return this.tournaments !== null;
  }

  get tournamentList() {
    if (!this.tournaments) return [];
    return this.tournaments.filter(
      (item: Tournament) =>
        !item.deleted &&
        item.completed === this.completed &&
        item.startedAt !== null &&
        hasStarted(new Date(item.startedAt ?? ""))
    );
  }
}
