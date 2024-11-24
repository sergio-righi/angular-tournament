import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TournamentFormat, TournamentMode, hasStarted, hasValue, isNotEmpty, setTimeToZero } from 'app/utils';
import { ActivatedRoute, Router } from '@angular/router';
import { Tournament } from 'app/models/tournament.model';
import { AuthService } from "app/models/auth.service";
import { TournamentRepository } from 'app/models/tournament.repository';
import { LocaleService } from 'app/models/locale.service';
import { Match } from 'app/models';
import { Round } from 'app/models/round.model';
import { BaseFormComponent } from 'app/components/shared/base/base-form.component';

@Component({
  selector: "app-tournament-add-edit",
  templateUrl: "./add-edit.component.html",
  styleUrls: ["./add-edit.component.scss"],
})
export class AddEditComponent extends BaseFormComponent {
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

  tournamentFormats = Object.keys(TournamentFormat)
    .filter((key) => isNaN(Number(key))) // Exclude numeric keys
    .map((key) => ({
      value: TournamentFormat[key as keyof typeof TournamentFormat],
      label: key,
    }));

  constructor(
    private repository: TournamentRepository,
    private router: Router,
    private auth: AuthService,
    private activeRoute: ActivatedRoute,
    public locale: LocaleService
  ) {
    super();
    this.title = locale.t.tournament.manage;
  }

  override async ngOnInit() {

    // Delete
    if (this.activeRoute.snapshot.params["mode"] === "delete") {
      this.deleteTournament(this.activeRoute.snapshot.params["id"]);
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
    return this.editing || (this.tournament?.participants?.length === 16 ?? false);
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

  onRoundFormatChange(round: Round, newFormat: TournamentFormat): void {

    if (round.matches && round.matches.length > 0) {
      round.matches.forEach((match: Match) => {
        match.format = newFormat;
      });
    }
  }

  onMatchFormatChange(round: Round, match: Match, newFormat: TournamentFormat): void {
    match.format = newFormat;
  }

  addParticipant() {
    const { length = 0 } = this.tournament?.participants || {};
    if (length < 16) {
      this.tournament.participants = length === 0 ? [] : this.tournament.participants;
      const quantity = length % 8 === 0 ? 8 : 8 - length % 8;
      for (let i = 0; i < quantity; i++) {
        const participant = { id: super.objectID, name: "" };
        this.tournament.participants.push(participant);
      }
    }
  }

  saveParticipant(index: number, event: any) {
    const { value } = event.target;
    if (isNotEmpty(value)) {
      this.tournament.participants[index].name = value;
    }
  }

  removeParticipant(index: number) {
    this.hasBeenRemoved = true;
    this.tournament.participants.splice(index, 1);
  }

  deleteTournament(id: string) {
    this.repository.deleteTournament(id);
    this.router.navigateByUrl("/tournament/list");
  }

  async saveTournament(form: NgForm) {
    this.isSubmitted = true;
    if (this.isNameValid && this.isParticipantValid && this.isStartDateValid) {
      if (!this.editing) {
        this.tournament.id = super.objectID;
        this.tournament.owner = this.auth.session.id;
        this.tournament.deleted = false;
        this.tournament.createdAt = Date.now();
        this.#generateTournament();
      }
      console.log(JSON.stringify(this.tournament));
      await this.repository.saveTournament(this.tournament);
      this.router.navigateByUrl("/tournament/list");
    }
  }

  #generateTournament() {
    const { length } = this.tournament.participants;
    if (!this.hasBeenRemoved && this.count === length) return;
    if (Number(this.tournament.mode) === TournamentMode.Knockout) {
      this.#generateKnockoutTournament(length);
    } else if (Number(this.tournament.mode) === TournamentMode.Swiss) {
      this.#generateSwissTournament(length);
    }
  }

  #generateKnockoutTournament(len: number): void {
    if (len === 16) {
      this.tournament.rounds.push(this.#generateRound(8, TournamentFormat.BestOfTwo, 0));
      this.tournament.rounds.push(this.#generateEmptyRound(4, TournamentFormat.BestOfTwo, 1));
      this.tournament.rounds.push(this.#generateEmptyRound(2, TournamentFormat.BestOfTwo, 2));
      this.tournament.rounds.push(this.#generateEmptyRound(1, TournamentFormat.BestOfOne, 3));
    } else if (len === 8) {
      this.tournament.rounds.push(this.#generateRound(4, TournamentFormat.BestOfTwo, 0));
      this.tournament.rounds.push(this.#generateEmptyRound(2, TournamentFormat.BestOfTwo, 1));
      this.tournament.rounds.push(this.#generateEmptyRound(1, TournamentFormat.BestOfOne, 2));
    } else if (len === 4) {
      this.tournament.rounds.push(this.#generateRound(2, TournamentFormat.BestOfTwo, 0));
      this.tournament.rounds.push(this.#generateEmptyRound(1, TournamentFormat.BestOfOne, 1));
    } else if (len === 2) {
      this.tournament.rounds.push(this.#generateRound(1, TournamentFormat.BestOfOne, 1));
    }
  }

  #generateSwissTournament(len: number): void {
    if (len === 16) {
      this.tournament.rounds.push(this.#generateRound(8, TournamentFormat.BestOfTwo, 0));
      this.tournament.rounds.push(this.#generateEmptyRound(8, TournamentFormat.BestOfTwo, 1));
      this.tournament.rounds.push(this.#generateEmptyRound(8, TournamentFormat.BestOfTwo, 2));
      this.tournament.rounds.push(this.#generateEmptyRound(6, TournamentFormat.BestOfOne, 3));
      this.tournament.rounds.push(this.#generateEmptyRound(3, TournamentFormat.BestOfOne, 4));
    } else if (len === 8) {
      this.tournament.rounds.push(this.#generateRound(4, TournamentFormat.BestOfTwo, 0));
      this.tournament.rounds.push(this.#generateEmptyRound(4, TournamentFormat.BestOfOne, 1));
      this.tournament.rounds.push(this.#generateEmptyRound(2, TournamentFormat.BestOfOne, 2));
    }
  }

  #generateMatchup(count: number, mode: TournamentMode, i: number): number[] {
    if (mode === TournamentMode.Knockout) {
      return [i * 2, i * 2 + 1];
    } else if (mode === TournamentMode.Swiss) {
      return [i, count + i];
    }
    return [];
  }

  #generateRound(count: number, format: TournamentFormat, index: number): Round {
    return {
      id: super.objectID,
      index: index,
      format: format,
      matches: Array.from({ length: count }, (_, i) => {
        const [p1, p2] = this.#generateMatchup(count, Number(this.tournament.mode), i);
        return {
          p1: this.tournament.participants[p1].id,
          p2: this.tournament.participants[p2].id,
          format: format,
          games: [],
          won: "",
          lost: "",
          diff: 0
        } as Match
      })
    } as Round
  }

  #generateEmptyRound(count: number, format: TournamentFormat, index: number): Round {
    return {
      id: super.objectID,
      index: index,
      format: format,
      matches: Array.from({ length: count }, (_) => ({ p1: "", p2: "", format: format, games: [], won: "", lost: "", diff: 0 } as Match))
    } as Round;
  }
}

