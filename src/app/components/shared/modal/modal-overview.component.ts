import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BaseTournamentComponent } from '../base';
import { LocaleService } from 'app/models/locale.service';
import { TournamentMode } from 'app/utils';
import { Game } from 'app/models/game.model';
import { Match } from 'app/models';

@Component({
  selector: 'app-overview-modal',
  templateUrl: './modal-overview.component.html',
  styleUrls: ['./modal-overview.component.scss'],
})
export class ModalOverviewComponent extends BaseTournamentComponent {
  @Input() override mode: TournamentMode = TournamentMode.Knockout;
  @Input() header: string = "";
  @Input() isOverviewModalVisible: boolean = false;
  @Input() data: any[] = [];

  @Output() close = new EventEmitter<void>();

  constructor(public override locale: LocaleService) {
    super(locale);
  }

  get isKnockout(): boolean {
    return this.mode === TournamentMode.Knockout;
  }

  get isSwiss(): boolean {
    return this.mode === TournamentMode.Swiss;
  }

  closeModal() {
    this.close.emit();
  }

  getRoundName(matches: Match[]): string {
    return {
      8: this.locale.t.tournament.knockout.round_of_16,
      4: this.locale.t.tournament.knockout.round_of_8,
      2: this.locale.t.tournament.knockout.round_of_4,
      1: this.locale.t.tournament.knockout.round_of_2
    }[matches.length] ?? "";
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
}
