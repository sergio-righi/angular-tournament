import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from 'app/models/auth.service';
import { Tournament } from "app/models/tournament.model";
import { TournamentRepository } from "app/models/tournament.repository";
import { toDateString } from 'app/utils';

@Component({
  selector: "app-tournament-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class ListComponent implements OnInit {
  title = "Tournament List";

  constructor(
    private repository: TournamentRepository,
    private auth: AuthService,
    private router: Router
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.repository.setTournaments();
  }

  get tournamentList(): Tournament[] {
    return this.repository.getTournaments().filter((item: Tournament) => {
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
    if (confirm("Are you sure?")) {
      this.repository.deleteTournament(id);
    }
  }
}
