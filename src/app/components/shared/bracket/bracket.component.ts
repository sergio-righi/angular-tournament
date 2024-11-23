import { Component, Input, OnInit } from '@angular/core';
import { Match } from 'app/models';
import { Game } from 'app/models/game.model';
import { LocaleService } from 'app/models/locale.service';

@Component({
  selector: 'app-bracket',
  templateUrl: './bracket.component.html',
  styleUrls: ['./bracket.component.scss']
})
export class BracketComponent implements OnInit {
  @Input() readonly: boolean = false;
  @Input() rounds: any = [];
  @Input() participants: { [id: string]: string } = {};

  isModalVisible: boolean = false; // Show the modal when managing games

  constructor(public locale: LocaleService) { }

  ngOnInit(): void { }

  get isEight(): boolean {
    return this.rounds[0].length === 4;
  }

  get roundCount(): number {
    return this.rounds.length;
  }

  openModal(): void {
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
  }

  hasWon(round: Match, won: string): boolean {
    return round.won !== "" && round.won === won;
  }

  getRoundName(matches: Match[]): string {
    return {
      8: this.locale.t.tournament.knockout.round_of_16,
      4: this.locale.t.tournament.knockout.round_of_8,
      2: this.locale.t.tournament.knockout.round_of_4,
      1: this.locale.t.tournament.knockout.round_of_2
    }[matches.length] ?? "";
  }

  getRoundIndex(len: number): number {
    return (this.isEight ? { 4: 1, 2: 2, 1: 3 }[len] : { 8: 0, 4: 1, 2: 2, 1: 3 }[len]) ?? -1;
  }

  getNextRoundIndex(len: number): number {
    return this.getRoundIndex(len) + 1;
  }

  getParticipant(id: string): string {
    return this.participants[id];
  }

  getGame(game: Game): string {
    return game.tiebreaker ? `${game.p1} (${game.tiebreaker?.p1}) x (${game.tiebreaker?.p2 ?? ""}) ${game.p2}` : `${game.p1} x ${game.p2}`
  }

  getGameScore(game: Game, participant: "p1" | "p2"): string {
    return game.tiebreaker ? `${game[participant]} (${game.tiebreaker[participant]})` : `${game[participant]}`;
  }

  roundLength(len: number) {
    return [...Array(Math.round(len / 2)).keys()];
  }

  matchupLength(len: number, i: number) {
    const value = i * 2 + 1;
    return len === 1 ? [value - 1] : [value - 1, value];
  }

  advance(len: number, match: number, won: string, lost: string) {
    const round = this.getRoundIndex(len);
    const item = this.rounds[round][match];
    if (item.p1 === "" || item.p2 === "") return;
    if (len > 1) {
      const { newRound, newMatch } = this.calculateNext(len, match);
      this.cascade(newRound, newMatch);
      if (round !== newRound) {
        const nextRound = this.rounds[newRound][newMatch];
        if (match % 2 === 0) {
          nextRound.p1 = won;
        } else {
          nextRound.p2 = won;
        }
      }
    }
    item.won = won;
    item.lost = lost;
  }

  calculateNext(len: number, match: number): any {
    const newMatch = Math.trunc(match / 2);
    const newRound = this.getNextRoundIndex(len);
    return { newRound, newMatch };
  }

  cascade(round: number, match: number): void {
    const currentMatch = this.rounds[round][match];

    // Clear the winner of the current match
    currentMatch.won = "";

    // Check if this is the last round
    if (round >= this.roundCount - 1) {
      return; // No subsequent rounds to clear
    }

    // Determine the next round and match indices
    const { newRound, newMatch } = this.calculateNext(this.rounds[round].length, match);
    const nextMatch = this.rounds[newRound][newMatch];

    // Clear only the affected participant in the next round
    if (match % 2 === 0) {
      nextMatch.p1 = ""; // Clear participant from the first position
    } else {
      nextMatch.p2 = ""; // Clear participant from the second position
    }

    this.cascade(newRound, newMatch);
  }
}
