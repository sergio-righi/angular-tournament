import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { hasStarted } from 'app/utils';
import { Tournament } from 'app/models';
import { AuthService } from "app/models/auth.service";
import { TournamentRepository } from 'app/models/tournament.repository';

@Component({
  selector: 'app-tournament-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  tournamentId: string = "";
  visible: boolean = false;
  tournament: Tournament = {} as Tournament;

  constructor(private repository: TournamentRepository,
    private router: Router,
    private auth: AuthService,
    private activeRoute: ActivatedRoute) {
  }

  async ngOnInit(): Promise<void> {
    await this.repository.setTournaments();
    this.tournamentId = this.activeRoute.snapshot.params["id"];
    if (this.tournamentId) {
      this.tournament = this.repository.getItem(this.tournamentId);
    } else {
      this.router.navigateByUrl("/");
    }
  }

  get isOwner(): boolean {
    return this.auth.authenticated && this.auth.session.id === this.tournament.owner;
  }

  get hasStarted(): boolean {
    return this.tournament.startedAt !== null && hasStarted(new Date(this.tournament.startedAt ?? ""));
  }

  get isReadOnly(): boolean {
    return !this.isOwner || this.tournament.completed || !this.hasStarted;
  }

  get hasWinner(): boolean {
    return this.tournament.rounds.r2 && this.tournament.rounds.r2[0].winner !== -1
  }

  saveTournament() {
    if (this.hasWinner) {
      this.tournament.completed = true;
      this.viewSummary();
    }
    this.repository.saveTournament(this.tournament);
  }

  viewSummary() {
    this.visible = true;
  }

  onClose(value: boolean) {
    this.visible = value;
  }
}