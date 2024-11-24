import { Component, Input, OnInit } from '@angular/core';
import { Match } from 'app/models';
import { Game } from 'app/models/game.model';
import { LocaleService } from 'app/models/locale.service';
import { BaseTournamentComponent } from 'app/components/shared/base';

@Component({
  selector: 'app-bracket',
  templateUrl: './bracket.component.html',
  styleUrls: ['./bracket.component.scss']
})
export class BracketComponent extends BaseTournamentComponent {
  isOverviewModalVisible: boolean = false; // Show the modal when managing games

  constructor(public override locale: LocaleService) {
    super(locale);
  }

  get isEight(): boolean {
    return this.rounds[0].matches.length === 4;
  }

  openOverviewModal(): void {
    this.isOverviewModalVisible = true;
  }

  closeOverviewModal(): void {
    this.isOverviewModalVisible = false;
  }

  hasWon(match: Match, won: string): boolean {
    return match.won !== "" && match.won === won;
  }

  getGameScore(game: Game, participant: "p1" | "p2"): string {
    return game.tiebreaker ? `${game[participant]} (${game.tiebreaker[participant]})` : `${game[participant]}`;
  }

  getRoundName(matches: Match[]): string {
    return {
      8: this.locale.t.tournament.knockout.round_of_16,
      4: this.locale.t.tournament.knockout.round_of_8,
      2: this.locale.t.tournament.knockout.round_of_4,
      1: this.locale.t.tournament.knockout.round_of_2
    }[matches.length] ?? "";
  }

  bracket(len: number) {
    return [...Array(Math.round(len / 2)).keys()];
  }

  matchup(len: number, i: number) {
    const value = i * 2 + 1;
    return len === 1 ? [value - 1] : [value - 1, value];
  }

  advance(round: number, match: number, won: string, lost: string) {
    const item = this.rounds[round].matches[match];
    if (item.p1 === "" || item.p2 === "") return;
    if (this.rounds[round].matches.length > 1) {
      const { newRound, newMatch } = this.calculateNext(round, match);
      this.cascade(newRound, newMatch);
      if (round !== newRound) {
        const nextRound = this.rounds[newRound].matches[newMatch];
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

  calculateNext(round: number, match: number): any {
    const newMatch = Math.trunc(match / 2);
    const newRound = round + 1;
    return { newRound, newMatch };
  }

  cascade(round: number, match: number): void {
    const currentMatch = this.rounds[round].matches[match];

    // Clear the winner of the current match
    currentMatch.won = "";
    currentMatch.games = [];

    // Check if this is the last round
    if (round >= this.roundCount - 1) {
      return; // No subsequent rounds to clear
    }

    // Determine the next round and match indices
    const { newRound, newMatch } = this.calculateNext(round, match);
    const nextMatch = this.rounds[newRound].matches[newMatch];

    if (nextMatch) {

      // Clear only the affected participant in the next round
      if (match % 2 === 0) {
        nextMatch.p1 = ""; // Clear participant from the first position
      } else {
        nextMatch.p2 = ""; // Clear participant from the second position
      }

      this.cascade(newRound, newMatch);
    }
  }

  override saveGames(): void {
    super.saveGames((currentMatch: Match) => {
      this.advance(this.selectedRound, this.selectedMatch, currentMatch.won, currentMatch.lost)
    });
  }
}