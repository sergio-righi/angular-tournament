import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { BaseTournamentComponent } from '../base';
import { LocaleService } from 'app/models/locale.service';
import { Game } from 'app/models/game.model';

@Component({
  selector: 'app-manage-game-modal',
  templateUrl: './modal-game.component.html',
  styleUrls: ['./modal-game.component.scss'],
})
export class ModalGameComponent extends BaseTournamentComponent {
  @Input() override isModalVisible: boolean = false;
  @Input() override selectedRound: number = -1;
  @Input() override selectedMatch: number = -1;
  @Input() override games: Game[] = [];

  @Output() close = new EventEmitter<void>();

  constructor(public override locale: LocaleService) {
    super(locale);
  }

  get hasAdd(): boolean {
    if (this.selectedRound >= 0 && this.selectedMatch >= 0) {
      const match = this.rounds[this.selectedRound].matches[this.selectedMatch];
      // if (match) {
      //   console.log(true);
      // } else {
      //   console.log(false);
      // }
    }
    return true;
  }

  closeModal() {
    this.close.emit();
  }
}
