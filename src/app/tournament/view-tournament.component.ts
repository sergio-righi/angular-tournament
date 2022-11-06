import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Participant, Round, Tournament } from '../core/models';
import { TournamentService } from '../core';

@Component({
  selector: 'app-view-tournament',
  templateUrl: './view-tournament.component.html',
  styleUrls: ['./view-tournament.component.scss']
})
export class ViewTournamentComponent implements OnInit {
  tournamentId: any;
  isSubmitted: boolean = false;
  viewTournamentForm: TournamentForm = new TournamentForm();

  @ViewChild("TournamentForm")
  tournamentForm!: NgForm;

  constructor(private route: ActivatedRoute, private router: Router, private tournamentService: TournamentService) {
  }

  ngOnInit(): void {
    this.tournamentId = this.route.snapshot.params['id'];
    this.findTournament();
  }

  get isReadOnly(): boolean {
    return this.viewTournamentForm.startDate === undefined || (this.viewTournamentForm.startDate !== undefined && Date.now() <= this.viewTournamentForm.startDate);
  }

  findTournament(): void {
    const tournament: Tournament | undefined = this.tournamentService.findById(this.tournamentId);
    if (tournament) {
      this.viewTournamentForm.id = tournament.id;
      this.viewTournamentForm.name = tournament.name;
      this.viewTournamentForm.participants = tournament.participants;
      this.viewTournamentForm.rounds = tournament.rounds;
      this.viewTournamentForm.startDate = tournament.startDate;
      this.viewTournamentForm.createdBy = tournament.createdBy;
    }
  }
}

export class TournamentForm implements Tournament {
  id: string = "";
  name: string = "";
  description?: string;
  participants: Participant[] = [];
  rounds: Round = {} as Round;
  createdBy: string = "";
  createdAt: number = Date.now();
  startDate?: number;
  deleted: boolean = false;
}