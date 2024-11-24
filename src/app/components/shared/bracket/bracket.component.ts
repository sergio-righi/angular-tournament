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
  @Input() rounds: Match[][] = [];
  @Input() participants: { [id: string]: string } = {};

  isOverviewModalVisible: boolean = false; // Show the modal when managing games
  isManageGamesModalVisible: boolean = false; // Show the modal when managing games

  selectedMatch: number = -1; // Track the match being edited
  selectedRound: number = -1; // Track the round being edited
  currentGames: Game[] = []; // Temporary storage for games while editing

  constructor(public locale: LocaleService) { }

  ngOnInit(): void { }

  get isEight(): boolean {
    return this.rounds[0].length === 4;
  }

  get hasTiebreaker(): boolean {
    return this.currentGames.length > 0 && this.currentGames[this.currentGames.length - 1].tiebreaker !== undefined;
  }

  get gameHeader(): string {
    if (this.selectedRound >= 0 && this.selectedMatch >= 0) {
      const match = this.rounds[this.selectedRound][this.selectedMatch];
      return `${this.getParticipant(match.p1)} vs ${this.getParticipant(match.p2)}`;
    }
    return "";
  }

  get roundCount(): number {
    return this.rounds.length;
  }

  openOverviewModal(): void {
    this.isOverviewModalVisible = true;
  }

  openManageGamesModal(round: number, match: number): void {
    this.selectedRound = round;
    this.selectedMatch = match;
    this.currentGames = [...this.rounds[this.selectedRound][match].games]; // Clone the games to a temporary array
    this.isManageGamesModalVisible = true;
  }

  closeOverviewModal(): void {
    this.isOverviewModalVisible = false;
  }

  closeManageGamesModal(): void {
    this.selectedRound = -1;
    this.selectedMatch = -1;
    this.isManageGamesModalVisible = false;
  }

  hasWon(match: Match, won: string): boolean {
    return match.won !== "" && match.won === won;
  }

  getRoundIndex(len: number): number {
    return (this.isEight ? { 4: 1, 2: 2, 1: 3 }[len] : { 8: 0, 4: 1, 2: 2, 1: 3 }[len]) ?? -1;
  }

  getRoundName(matches: Match[]): string {
    return {
      8: this.locale.t.tournament.knockout.round_of_16,
      4: this.locale.t.tournament.knockout.round_of_8,
      2: this.locale.t.tournament.knockout.round_of_4,
      1: this.locale.t.tournament.knockout.round_of_2
    }[matches.length] ?? "";
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

  advance(round: number, match: number, won: string, lost: string) {
    const item = this.rounds[round][match];
    if (item.p1 === "" || item.p2 === "") return;
    if (this.rounds[round].length > 1) {
      const { newRound, newMatch } = this.calculateNext(round, match);
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

  calculateNext(round: number, match: number): any {
    const newMatch = Math.trunc(match / 2);
    const newRound = round + 1;
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
    const { newRound, newMatch } = this.calculateNext(round, match);
    const nextMatch = this.rounds[newRound][newMatch];

    if (nextMatch) {

      // Clear only the affected participant in the next round
      if (match % 2 === 0) {
        nextMatch.p1 = ""; // Clear participant from the first position
      } else {
        nextMatch.p2 = ""; // Clear participant from the second position
      }

      nextMatch.games = [];

      this.cascade(newRound, newMatch);
    }
  }

  // Add a new game to the temporary list
  addGame(): void {
    this.currentGames.push({ p1: 0, p2: 0 });
  }

  // Remove a game by index
  removeGame(index: number): void {
    this.currentGames.splice(index, 1);
  }

  toggleTiebreaker(index: number): void {
    const game = this.currentGames[index];
    if (game.tiebreaker) {
      // Remove tiebreaker
      delete game.tiebreaker;
    } else {
      // Add tiebreaker with default values
      game.tiebreaker = { p1: 0, p2: 0 };
    }
  }

  // Save changes to the match's games
  saveGames(): void {
    if (this.selectedRound >= 0 && this.selectedMatch >= 0) {
      const currentMatch = this.rounds[this.selectedRound][this.selectedMatch];
      currentMatch.games = [...this.currentGames]; // Update the match's games

      let p1Score = 0;
      let p2Score = 0;
      let hasTiebreaker = false;

      // Iterate through the games
      currentMatch.games.forEach((game: Game) => {
        if (game.tiebreaker) {
          // If a tiebreaker exists, only consider tiebreaker scores
          p1Score += game.tiebreaker.p1;
          p2Score += game.tiebreaker.p2;
          hasTiebreaker = true; // Mark that tiebreakers are present
        } else if (!hasTiebreaker) {
          // If no tiebreaker has been found so far, consider the normal scores
          p1Score += game.p1;
          p2Score += game.p2;
        }
      });

      // Determine the winner and loser based on the scores
      if (p1Score > p2Score) {
        currentMatch.won = currentMatch.p1;
        currentMatch.lost = currentMatch.p2;
      } else if (p1Score < p2Score) {
        currentMatch.won = currentMatch.p2;
        currentMatch.lost = currentMatch.p1;
      } else {
        // It's a tie
        currentMatch.won = "";
        currentMatch.lost = "";
      }

      // Calculate the score difference (absolute value)
      currentMatch.diff = Math.abs(p1Score - p2Score);

      this.advance(this.selectedRound, this.selectedMatch, currentMatch.won, currentMatch.lost)
    }

    this.closeManageGamesModal(); // Close modal after saving
  }
}
