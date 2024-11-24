import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ObjectID } from 'bson'
import { TournamentMode, hasStarted, hasValue, isNotEmpty, setTimeToZero } from 'app/utils';
import { ActivatedRoute, Router } from '@angular/router';
import { Tournament } from 'app/models/tournament.model';
import { AuthService } from "app/models/auth.service";
import { TournamentRepository } from 'app/models/tournament.repository';
import { LocaleService } from 'app/models/locale.service';
import { Match } from 'app/models';

@Component({
  selector: "app-tournament-add-edit",
  templateUrl: "./add-edit.component.html",
  styleUrls: ["./add-edit.component.scss"],
})
export class AddEditComponent implements OnInit {
  title: string;
  count: number = 0;
  hasBeenRemoved: boolean = false;
  isSubmitted: boolean = false;
  editing: boolean = false;
  tournament: Tournament = Tournament.default;

  tournamentModes = Object.keys(TournamentMode)
    .filter((key) => isNaN(Number(key))) // Exclude numeric keys
    .map((key) => ({
      value: TournamentMode[key as keyof typeof TournamentMode],
      label: key,
    }));

  constructor(
    private repository: TournamentRepository,
    private router: Router,
    private auth: AuthService,
    private activeRoute: ActivatedRoute,
    public locale: LocaleService
  ) {
    this.title = locale.t.tournament.manage;
  }

  async ngOnInit() {

    // Delete
    if (this.activeRoute.snapshot.params["mode"] === "delete") {
      this.deleteItem(this.activeRoute.snapshot.params["id"]);
    }

    this.editing = this.activeRoute.snapshot.params["mode"] === "edit";

    // Edit
    if (this.editing) {
      this.tournament = await this.repository.findTournament(this.activeRoute.snapshot.params["id"]);
      this.count = this.tournament.participants?.length || 0;
    }
  }

  get hasStarted(): boolean {
    return this.tournament.startedAt !== null && hasStarted(new Date(this.tournament.startedAt + 'T10:00:00'));
  }

  get isReadOnly(): boolean {
    return this.editing && (this.tournament.completed || this.hasStarted);
  }

  get isDisabled(): boolean {
    return this.tournament?.participants?.length === 16 ?? false;
  }

  get isNameValid(): boolean {
    return isNotEmpty(this.tournament.name ?? "");
  }

  get isModeValid(): boolean {
    return this.tournament.mode !== null && this.tournament.mode !== undefined;
  }

  get isParticipantValid(): boolean {
    const { length = 0 } = this.tournament?.participants || {};
    const isValid = length > 0 && length % 8 === 0;
    if (isValid) {
      return this.tournament.participants.every(x => hasValue(x.name) && isNotEmpty(x.name));
    }
    return false;
  }

  get isStartDateValid(): boolean {
    return this.tournament.startedAt !== null && (setTimeToZero(new Date(this.tournament.startedAt + 'T10:00:00')) >= setTimeToZero(new Date()) || this.editing);
  }

  async save(form: NgForm) {
    this.isSubmitted = true;
    // TODO: add validations to the form
    if (this.isNameValid && this.isParticipantValid && this.isStartDateValid) {
      if (!this.editing) {
        this.tournament.owner = this.auth.session.id;
        this.tournament.deleted = false;
        this.tournament.createdAt = Date.now();
      }
      this.#generateTournament();
      await this.repository.saveTournament(this.tournament);
      this.router.navigateByUrl("/tournament/list");
    }
  }

  private deleteItem(id: string) {
    this.repository.deleteTournament(id);
    this.router.navigateByUrl("/tournament/list");
  }

  addParticipant() {
    const { length = 0 } = this.tournament?.participants || {};
    if (length < 16) {
      this.tournament.participants = length === 0 ? [] : this.tournament.participants;
      const quantity = length % 8 === 0 ? 8 : 8 - length % 8;
      for (let i = 0; i < quantity; i++) {
        const participant = { id: new ObjectID().toString(), name: "" };
        this.tournament.participants.push(participant);
      }
    }
  }

  saveParticipant(index: number, event: any) {
    const { value } = event.target;
    if (isNotEmpty(value)) {
      this.tournament.participants[index].name = value;
    }
    // } else {
    //   this.removeParticipant(index);
    // }
  }

  removeParticipant(index: number) {
    this.hasBeenRemoved = true;
    this.tournament.participants.splice(index, 1);
  }

  #generateTournament() {
    const { length } = this.tournament.participants;
    if (!this.hasBeenRemoved && this.count === length) return;
    // if (length === 16) {
    //   this.tournament.rounds.push(this.#generateRound(8));
    //   this.tournament.rounds.push(this.#generateEmptyRound(4));
    // } else if (length === 8) {
    //   this.tournament.rounds.push([]);
    //   this.tournament.rounds.push(this.#generateRound(4));
    // }
    // this.tournament.rounds.push(this.#generateEmptyRound(2));
    // this.tournament.rounds.push(this.#generateEmptyRound(1));
  }

  #generateRound(count: number) {
    // let jump = 0;
    // return Array.from({ length: count }, (_, i) => {
    //   const index = jump++ + i;
    //   return { p1: this.tournament.participants[index].id, p2: this.tournament.participants[index + 1].id, games: [], won: "", lost: "", diff: 0 } as Match
    // });
  }

  #generateEmptyRound(count: number) {
    // return Array.from({ length: count }, (_) => ({ p1: "", p2: "", games: [], won: "", lost: "", diff: 0 } as Match));
  }
}

