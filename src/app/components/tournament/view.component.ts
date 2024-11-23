import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { hasStarted, TournamentMode } from 'app/utils';
import { Participant, Tournament } from 'app/models';
import { AuthService } from "app/models/auth.service";
import { TournamentRepository } from 'app/models/tournament.repository';
import { LocaleService } from 'app/models/locale.service';

@Component({
  selector: 'app-tournament-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  tournamentMode = {
    Swiss: TournamentMode.Swiss,
    Knockout: TournamentMode.Knockout
  }

  tournamentId: string = "";
  tournament: Tournament | null = null;
  isModalVisible: boolean = false; // Show the modal when managing games

  constructor(private repository: TournamentRepository,
    private router: Router,
    private auth: AuthService,
    private activeRoute: ActivatedRoute,
    public locale: LocaleService) {
  }

  async ngOnInit(): Promise<void> {
    this.tournamentId = this.activeRoute.snapshot.params["id"];
    if (this.tournamentId) {
      this.tournament = await this.repository.findTournament(this.tournamentId);
    } else {
      this.router.navigateByUrl("/");
    }
  }

  get isReady(): boolean {
    return this.tournament !== null;
  }

  get participants(): { [id: string]: string } {
    if (!this.isReady) return {};
    const participants: { [id: string]: string } = {};
    this.tournament?.participants.forEach((participant: Participant) => {
      participants[participant.id] = participant.name;
    });
    return participants;
  }

  get isOwner(): boolean {
    return this.auth.authenticated && this.auth.session.id === this.tournament?.owner;
  }

  get hasStarted(): boolean {
    return this.tournament?.startedAt !== null && hasStarted(new Date(this.tournament?.startedAt ?? ""));
  }

  get isReadOnly(): boolean {
    return !this.isOwner || this.tournament?.completed || !this.hasStarted;
  }

  get hasWinner(): boolean {
    return this.tournament?.rounds[this.tournament.rounds.length - 1].won !== ""
  }

  saveTournament() {
    if (!this.tournament) return;
    if (this.hasWinner) {
      this.tournament.completed = true;
    }
    this.repository.saveTournament(this.tournament);
  }


  openModal(): void {
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
  }
}