import { Component, SimpleChanges } from '@angular/core';
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
  currentRound: number = 0;
  isGameModalVisible: boolean = false;
  isOverviewModalVisible: boolean = false; // Show the modal when managing games
  standings: Standings[] = [];
  controller!: SwissTournament;

  constructor(public override locale: LocaleService) {
    super(locale);
  }

  override ngOnInit(): void {
    this.controller = new SwissTournament(Object.keys(this.participants), 8);
    this.completeRounds.forEach((round: Round, index: number) => {
      this.currentRound = index;
      this.controller.generateRound();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.controller) return;
    const newCurrentRound = this.completeRounds.length;
    if (this.currentRound !== newCurrentRound) {
      this.controller.processResults(this.rounds[this.currentRound].matches);
      const matches = this.controller.generateRound();
      if (matches.length > 0) {
        this.rounds[newCurrentRound].matches = this.rounds[newCurrentRound].matches.map((match: Match, i: number) => {
          return { ...match, ...matches[i] };
        });
        this.currentRound = newCurrentRound;
      }
    }
  }

  get activeRounds(): Round[] {
    return this.rounds.filter((round: Round) => round.matches[0].p1 !== "");
  }

  get completeRounds(): Round[] {
    return this.rounds.filter((round: Round) =>
      round.matches.every(match => match.won !== "" && match.lost !== "")
    );
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

  getMatches(rounds: Round[]): Match[][] {
    return rounds.reduce((acc: Match[][], round: Round) => {
      acc.push(round.matches); // Add each round's matches array to the accumulator
      return acc;
    }, []);
  }

  openOverviewModal(): void {
    this.standings = this.controller.generateStandings();
    this.isOverviewModalVisible = true;
  }

  closeOverviewModal(): void {
    this.isOverviewModalVisible = false;
  }

  override openGameModal(round: number, match: number): void {
    super.openGameModal(round, match);
    this.isGameModalVisible = true;
  }

  override closeGameModal(): void {
    super.closeGameModal();
    this.isGameModalVisible = false;
  }

  override saveGames(callback?: Function | undefined): void {
    super.saveGames(callback);
    this.isGameModalVisible = false;
  }
}
