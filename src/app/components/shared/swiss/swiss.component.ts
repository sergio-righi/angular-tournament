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
  @Input() rounds: any = [];
  @Input() participants: { [id: string]: string } = {};

  isStandingsModalVisible: boolean = false; // Show the modal when managing games
  isManageGamesModalVisible: boolean = false; // Show the modal when managing games

  selectedMatch: Match | null = null; // Track the match being edited
  currentGames: Game[] = []; // Temporary storage for games while editing
  standings: Standings[] = [];

  constructor(public locale: LocaleService) { }

  ngOnInit(): void { }

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
  openManageGamesModal(match: Match): void {
    this.selectedMatch = match;
    this.currentGames = [...match.games]; // Clone the games to a temporary array
    this.isManageGamesModalVisible = true;
  }

  // Close the modal
  closeManageGamesModal(): void {
    this.selectedMatch = null;
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
    if (this.selectedMatch) {
      // Update the match's games
      this.selectedMatch.games = [...this.currentGames];

      // Initialize accumulated scores for players
      let player1TotalScore = 0;
      let player2TotalScore = 0;

      // Calculate the total score for each player across all games
      this.selectedMatch.games.forEach(game => {
        player1TotalScore += game.p1;
        player2TotalScore += game.p2;
      });

      // Determine the winner and loser based on accumulated scores
      if (player1TotalScore > player2TotalScore) {
        // Player 1 wins
        this.selectedMatch.won = this.selectedMatch.p1;
        this.selectedMatch.lost = this.selectedMatch.p2;
      } else if (player1TotalScore < player2TotalScore) {
        // Player 2 wins
        this.selectedMatch.won = this.selectedMatch.p2;
        this.selectedMatch.lost = this.selectedMatch.p1;
      } else {
        // It's a tie based on total score
        this.selectedMatch.won = ""; // Or however you want to represent a tie
        this.selectedMatch.lost = ""; // Or however you want to represent a tie
      }

      // Calculate the score difference (absolute value of the total score difference)
      this.selectedMatch.diff = Math.abs(player1TotalScore - player2TotalScore);
    }

    // Close the modal after saving
    this.closeManageGamesModal();
  }
}
