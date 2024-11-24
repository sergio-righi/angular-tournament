import { Input, OnInit } from '@angular/core';
import { Game } from 'app/models/game.model';
import { Round } from 'app/models/round.model';
import { LocaleService } from 'app/models/locale.service';
import { Directive } from '@angular/core';
import { Match } from 'app/models';

@Directive({
  selector: '[appBaseTournament]'
})
export abstract class BaseTournamentComponent implements OnInit {
  @Input() readonly: boolean = false;
  @Input() rounds: Round[] = [];
  @Input() participants: { [id: string]: string } = {};

  isManageGamesModalVisible: boolean = false;
  selectedRound: number = -1;
  selectedMatch: number = -1;
  currentGames: Game[] = [];

  constructor(public locale: LocaleService) { }

  ngOnInit(): void { }

  get roundCount(): number {
    return this.rounds.length;
  }

  get gameHeader(): string {
    if (this.selectedRound >= 0 && this.selectedMatch >= 0) {
      const match = this.rounds[this.selectedRound].matches[this.selectedMatch];
      return `${this.getParticipant(match.p1)} vs ${this.getParticipant(match.p2)}`;
    }
    return '';
  }

  get hasTiebreaker(): boolean {
    return this.currentGames.length > 0 && this.currentGames[this.currentGames.length - 1].tiebreaker !== undefined;
  }

  getParticipant(id: string): string {
    return this.participants[id] || "TBD";
  }

  getGame(game: Game): string {
    return game.tiebreaker
      ? `${game.p1} (${game.tiebreaker?.p1}) x (${game.tiebreaker?.p2 ?? ''}) ${game.p2}`
      : `${game.p1} x ${game.p2}`;
  }

  openManageGamesModal(round: number, match: number): void {
    this.selectedRound = round;
    this.selectedMatch = match;
    this.currentGames = [...this.rounds[this.selectedRound].matches[match].games];
    this.isManageGamesModalVisible = true;
  }

  closeManageGamesModal(): void {
    this.selectedRound = -1;
    this.selectedMatch = -1;
    this.isManageGamesModalVisible = false;
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

  addGame(): void {
    this.currentGames.push({ p1: 0, p2: 0 });
  }

  removeGame(index: number): void {
    this.currentGames.splice(index, 1);
  }

  saveGames(callback?: Function): void {
    if (this.selectedRound >= 0 && this.selectedMatch >= 0) {
      const currentMatch = this.rounds[this.selectedRound].matches[this.selectedMatch];
      currentMatch.games = [...this.currentGames];

      let p1Score = 0;
      let p2Score = 0;
      let hasTiebreaker = false;

      currentMatch.games.forEach((game: Game) => {
        if (game.tiebreaker) {
          p1Score += game.tiebreaker.p1;
          p2Score += game.tiebreaker.p2;
          hasTiebreaker = true;
        } else if (!hasTiebreaker) {
          p1Score += game.p1;
          p2Score += game.p2;
        }
      });

      if (p1Score > p2Score) {
        currentMatch.won = currentMatch.p1;
        currentMatch.lost = currentMatch.p2;
      } else if (p1Score < p2Score) {
        currentMatch.won = currentMatch.p2;
        currentMatch.lost = currentMatch.p1;
      } else {
        currentMatch.won = '';
        currentMatch.lost = '';
      }

      currentMatch.diff = Math.abs(p1Score - p2Score);

      callback && callback(currentMatch);
    }
    this.closeManageGamesModal();
  }
}