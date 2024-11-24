import { Component, Input, OnInit } from '@angular/core';
import { Match } from 'app/models';
import { Game } from 'app/models/game.model';
import { LocaleService } from 'app/models/locale.service';
import { Standings } from 'app/models/standings.model';
import { SwissTournament } from 'app/utils';

@Component({
  selector: 'app-swiss',
  templateUrl: './swiss.component.html',
  styleUrls: ['./swiss.component.scss']
})
export class SwissComponent implements OnInit {
  @Input() readonly: boolean = false;
  @Input() rounds: Match[][] = [];
  @Input() participants: { [id: string]: string } = {};

  isStandingsModalVisible: boolean = false; // Show the modal when managing games
  isManageGamesModalVisible: boolean = false; // Show the modal when managing games

  selectedRound: number = -1; // Track the round being edited
  selectedMatch: number = -1; // Track the match being edited
  currentGames: Game[] = []; // Temporary storage for games while editing
  standings: Standings[] = [];

  constructor(public locale: LocaleService) { }

  ngOnInit(): void { }

  get gameHeader(): string {
    if (this.selectedRound >= 0 && this.selectedMatch >= 0) {
      const match = this.rounds[this.selectedRound][this.selectedMatch];
      return `${this.getParticipant(match.p1)} vs ${this.getParticipant(match.p2)}`;
    }
    return "";
  }

  getParticipant(id: string): string {
    return this.participants[id];
  }

  getGame(game: Game): string {
    return game.tiebreaker ? `${game.p1} (${game.tiebreaker?.p1}) x (${game.tiebreaker?.p2 ?? ""}) ${game.p2}` : `${game.p1} x ${game.p2}`
  }

  shouldHighlight(match: Match, game: Game): boolean {
    if (game.p1 > game.p2) {
      return match.won === match.p1;
    } else if (game.p1 === game.p2) {
      return true;
    } else {
      return match.won === match.p2;
    }
  }

  // Method to calculate total scores
  getScore(participant: string) {
    let won = 0, lost = 0;

    // Iterate through each round
    for (const round of this.rounds) {
      // Iterate through each match in the round
      for (const match of round) {
        if (match.p1 === participant) {
          // Add scores for p1
          won += match.games.reduce((acc: number, game: Game) => acc + game.p1, 0);
          lost += match.games.reduce((acc: number, game: Game) => acc + game.p2, 0);
        } else if (match.p2 === participant) {
          // Add scores for p2
          won += match.games.reduce((acc: number, game: Game) => acc + game.p2, 0);
          lost += match.games.reduce((acc: number, game: Game) => acc + game.p1, 0);
        }
      }
    }

    return { won, lost };
  }

  openStandingsModal(): void {
    const swissTournament = new SwissTournament(Object.keys(this.participants), 8);
    swissTournament.simulateTournament(this.rounds);
    this.standings = swissTournament.standings;
    this.isStandingsModalVisible = true;
  }

  closeStandingsModal(): void {
    this.isStandingsModalVisible = false;
  }

  // Open the modal to manage games for a specific match
  openManageGamesModal(round: number, match: number): void {
    this.selectedRound = round;
    this.selectedMatch = match;
    this.currentGames = [...this.rounds[this.selectedRound][match].games]; // Clone the games to a temporary array
    this.isManageGamesModalVisible = true;
  }

  // Close the modal
  closeManageGamesModal(): void {
    this.selectedRound = -1;
    this.selectedMatch = -1;
    this.isManageGamesModalVisible = false;
  }

  // Add a new game to the temporary list
  addGame(): void {
    this.currentGames.push({ p1: 0, p2: 0 }); // Add a default game
  }

  // Remove a game by index
  removeGame(index: number): void {
    this.currentGames.splice(index, 1);
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

      // Close the modal after saving
      this.closeManageGamesModal();
    }
  }
}
