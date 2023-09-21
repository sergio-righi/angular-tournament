import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from 'app/models/auth.service';
import { LocaleService } from "app/models/locale.service";
import { Tournament } from "app/models/tournament.model";
import { TournamentRepository } from "app/models/tournament.repository";
import { toDateString } from 'app/utils';

@Component({
  selector: "app-tournament-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class ListComponent implements OnInit {
  title: string;

  constructor(
    private repository: TournamentRepository,
    private auth: AuthService,
    private router: Router,
    public locale: LocaleService
  ) {
    this.title = locale.t.title.tournament_list;
  }

  async ngOnInit() { }

  get tournamentList(): Tournament[] {
    return this.repository.tournaments.filter((item: Tournament) => {
      return item.owner === this.auth.session.id;
    });
  }

  get isReady(): boolean {
    return this.repository.isReady;
  }

  toDateString(value: any) {
    return toDateString(value);
  }

  deleteMethod(id: string) {
    if (confirm(this.locale.t.message.delete_confirmation)) {
      this.repository.deleteTournament(id);
    }
  }
}
