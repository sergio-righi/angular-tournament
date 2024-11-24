import { Component } from '@angular/core';
import { Match } from 'app/models';
import { Game } from 'app/models/game.model';
import { LocaleService } from 'app/models/locale.service';
import { Standings } from 'app/models/standings.model';
import { SwissTournament } from 'app/utils';
import { BaseTournamentComponent } from '../base';
import { Round } from 'app/models/round.model';

@Component({
  selector: 'app-swiss',
  templateUrl: './swiss.component.html',
  styleUrls: ['./swiss.component.scss']
})
export class SwissComponent extends BaseTournamentComponent {
  isStandingsModalVisible: boolean = false; // Show the modal when managing games
  standings: Standings[] = [];

  constructor(public override locale: LocaleService) {
    super(locale);
  }

  get activeRounds(): Round[] {
    return this.rounds.filter((round: Round) => round.matches[0].p1 !== "");
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
      for (const match of round.matches) {
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
    swissTournament.simulateTournament(this.rounds.reduce((acc: Match[][], round: Round) => {
      acc.push(round.matches); // Add each round's matches array to the accumulator
      return acc;
    }, []));
    this.standings = swissTournament.standings;
    this.isStandingsModalVisible = true;
  }

  closeStandingsModal(): void {
    this.isStandingsModalVisible = false;
  }
}
