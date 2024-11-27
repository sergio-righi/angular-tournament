import { Input, OnInit } from '@angular/core';
import { Game } from 'app/models/game.model';
import { Round } from 'app/models/round.model';
import { LocaleService } from 'app/models/locale.service';
import { Directive } from '@angular/core';
import { TournamentMode } from 'app/utils';

@Directive({
  selector: '[appBaseTournament]'
})
export abstract class BaseTournamentComponent implements OnInit {
  @Input() readonly: boolean = false;
  @Input() mode: TournamentMode = TournamentMode.Knockout;
  @Input() rounds: Round[] = [];
  @Input() participants: { [id: string]: string } = {};

  selectedRound: number = -1;
  selectedMatch: number = -1;
  games: Game[] = [];

  constructor(public locale: LocaleService) { }

  ngOnInit(): void { }

  get roundCount(): number {
    return this.rounds.length;
  }

  getParticipant(id: string): string {
    return this.participants[id] || "TBD";
  }

  getGame(game: Game): string {
    return game.tiebreaker
      ? `${game.p1} (${game.tiebreaker?.p1}) x (${game.tiebreaker?.p2 ?? ''}) ${game.p2}`
      : `${game.p1} x ${game.p2}`;
  }

  openGameModal(round: number, match: number): void {
    this.selectedRound = round;
    this.selectedMatch = match;
    this.games = [...this.rounds[this.selectedRound].matches[match].games];
  }

  closeGameModal(): void {
    this.selectedRound = -1;
    this.selectedMatch = -1;
  }

  addGame(): void {
    this.games.push({ p1: 0, p2: 0 });
  }

  removeGame(index: number): void {
    this.games.splice(index, 1);
  }

  saveGames(callback?: Function): void {
    if (this.selectedRound >= 0 && this.selectedMatch >= 0) {
      const currentMatch = this.rounds[this.selectedRound].matches[this.selectedMatch];
      currentMatch.games = [...this.games];

      let p1Wins = 0;
      let p2Wins = 0;

      let p1Tiebreaker = 0;
      let p2Tiebreaker = 0;

      // Calculate the number of games each player has won
      currentMatch.games.forEach((game: Game) => {
        let p1Score = game.p1;
        let p2Score = game.p2;

        if (p1Score > p2Score) {
          p1Wins++;
        } else if (p2Score > p1Score) {
          p2Wins++;
        }
      });

      // Calculate total score difference
      const p1Score = currentMatch.games.reduce((sum, game) => sum + game.p1, 0);
      const p2Score = currentMatch.games.reduce((sum, game) => sum + game.p2, 0);

      const lastMatch = currentMatch.games[currentMatch.games.length - 1];
      if (lastMatch && lastMatch.tiebreaker) {
        p1Tiebreaker = lastMatch.tiebreaker.p1;
        p2Tiebreaker = lastMatch.tiebreaker.p2;
      }

      // Determine the required number of wins
      const requiredWins = Math.floor(currentMatch.format / 2 + 1);

      // Decide the match outcome based on the format and wins
      if (currentMatch.format % 2 === 0 && currentMatch.games.length === requiredWins) {
        if (p1Score > p2Score || p1Tiebreaker > p2Tiebreaker) {
          currentMatch.won = currentMatch.p1;
          currentMatch.lost = currentMatch.p2;
        } else if (p2Score > p1Score || p2Tiebreaker > p1Tiebreaker) {
          currentMatch.won = currentMatch.p2;
          currentMatch.lost = currentMatch.p1;
        }
      } else if (p1Wins === requiredWins || p2Wins === requiredWins) {
        if (p1Wins > p2Wins || p1Tiebreaker > p2Tiebreaker) {
          currentMatch.won = currentMatch.p1;
          currentMatch.lost = currentMatch.p2;
        } else if (p2Wins > p1Wins || p2Tiebreaker > p1Tiebreaker) {
          currentMatch.won = currentMatch.p2;
          currentMatch.lost = currentMatch.p1;
        }
      } else {
        // Winner cannot be determined yet
        currentMatch.won = '';
        currentMatch.lost = '';
      }

      currentMatch.diff = Math.abs(p1Score - p2Score);

      callback && callback(currentMatch);
    }

    this.closeGameModal();
  }
}