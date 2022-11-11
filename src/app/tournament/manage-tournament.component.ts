import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ObjectID } from 'bson'
import { Participant, Round, Tournament } from '../core/models';
import { TournamentService } from '../core/services';
import { toDateString } from '../core/utils';

@Component({
  selector: 'app-manage-tournament',
  templateUrl: './manage-tournament.component.html',
  styleUrls: ['./manage-tournament.component.scss']
})
export class ManageTournamentComponent implements OnInit {
  tournamentId!: string;
  isSubmitted: boolean = false;
  manageTournamentForm: TournamentForm = new TournamentForm();

  @ViewChild("TournamentForm")
  tournamentForm!: NgForm;

  constructor(private route: ActivatedRoute, private router: Router, private tournamentService: TournamentService) {
  }

  ngOnInit(): void {
    this.tournamentId = this.route.snapshot.params['id'];
    this.findTournament();
  }

  get isReadOnly(): boolean {
    return this.manageTournamentForm.completed || this.manageTournamentForm.startDate === undefined || (this.manageTournamentForm.startDate !== undefined && Date.now() <= this.manageTournamentForm.startDate);
  }

  get isParticipantValid(): boolean {
    const { length } = this.manageTournamentForm.participants;
    return length > 0 && length % 8 === 0;
  }

  findTournament(): void {
    const tournament: Tournament | undefined = this.tournamentService.findById(this.tournamentId);
    if (tournament) {
      this.manageTournamentForm.id = tournament.id;
      this.manageTournamentForm.name = tournament.name;
      this.manageTournamentForm.description = tournament.description;
      this.manageTournamentForm.participants = tournament.participants;
      this.manageTournamentForm.rounds = tournament.rounds;
      this.manageTournamentForm.startDate = tournament.startDate;
      this.manageTournamentForm.deleted = tournament.deleted;
    }
  }

  addParticipant() {
    const { length } = this.manageTournamentForm.participants;
    if (length < 16) {
      const quantity = length % 8 === 0 ? 8 : 8 - length % 8;
      for (let i = 0; i < quantity; i++) {
        const participant = { id: new ObjectID().toString(), name: "" };
        this.manageTournamentForm.participants.push(participant);
      }
    }
  }

  saveParticipant(index: number, event: any) {
    const { value } = event.target;
    if (value) {
      this.manageTournamentForm.participants[index].name = value;
    } else {
      this.removeParticipant(index);
    }
  }

  removeParticipant(index: number) {
    this.manageTournamentForm.participants.splice(index, 1);
  }

  saveTournament(isValid: boolean) {
    this.isSubmitted = true;
    if (isValid && this.isParticipantValid) {
      if (this.tournamentId) {
        this.tournamentService.update(this.tournamentId, this.manageTournamentForm);
      } else {
        this.#generateTournament();
        this.manageTournamentForm.createdBy = "";
        this.manageTournamentForm.deleted = false;
        this.manageTournamentForm.createdAt = Date.now();
        this.tournamentService.insert(this.manageTournamentForm);
        this.router.navigate(['']);
      }
    }
  }

  #generateTournament() {
    const { length } = this.manageTournamentForm.participants;
    if (length === 16) {
      this.manageTournamentForm.rounds.r16 = this.#generateRound(8);
      this.manageTournamentForm.rounds.r8 = this.#generateEmptyRound(4);
    } else if (length === 8) {
      this.manageTournamentForm.rounds.r8 = this.#generateRound(4);
    }
    this.manageTournamentForm.rounds.r4 = this.#generateEmptyRound(2);
    this.manageTournamentForm.rounds.r2 = this.#generateEmptyRound(1);
  }

  #generateRound(count: number) {
    return Array.from({ length: count }, (_, i) => ({ x: this.manageTournamentForm.participants[i].id, y: this.manageTournamentForm.participants[i + 1].id, winner: -1 }));
  }

  #generateEmptyRound(count: number) {
    return Array.from({ length: count }, (_, i) => ({ x: "", y: "", winner: -1 }));
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
  completed: boolean = false;
  deleted: boolean = false;

  get startDateString(): string {
    return this.startDate ? toDateString(this.startDate) : "";
  }

  set startDateString(value: string) {
    this.startDate = new Date(value).getTime();
  }
}