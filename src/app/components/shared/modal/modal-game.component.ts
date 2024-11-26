import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseTournamentComponent } from '../base';
import { LocaleService } from 'app/models/locale.service';
import { Game } from 'app/models/game.model';
import { Round } from 'app/models/round.model';
import { TournamentMode } from 'app/utils';

@Component({
  selector: 'app-manage-game-modal',
  templateUrl: './modal-game.component.html',
  styleUrls: ['./modal-game.component.scss'],
})
export class ModalGameComponent implements OnInit {
  @Input() mode: TournamentMode = TournamentMode.Knockout;
  @Input() participants: { [id: string]: string } = {};
  @Input() isGameModalVisible: boolean = false;
  @Input() selectedRound: number = -1;
  @Input() selectedMatch: number = -1;
  @Input() games: Game[] = [];
  @Input() rounds: Round[] = [];

  @Output() onAdd = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<void>();
  @Output() onRemove = new EventEmitter<number>();
  @Output() onClose = new EventEmitter<void>();

  constructor(public locale: LocaleService) {
  }

  ngOnInit(): void { }

  get hasTiebreaker(): boolean {
    return this.games.length > 0 && this.games[this.games.length - 1].tiebreaker !== undefined;
  }

  get hasAdd(): boolean {
    if (this.selectedRound >= 0 && this.selectedMatch >= 0) {
      const match = this.rounds[this.selectedRound].matches[this.selectedMatch];
      if (match) {
        return this.games.length < Math.floor(match.format / 2 + 1);
      }
    }
    return true;
  }

  get gameHeader(): string {
    if (this.selectedRound >= 0 && this.selectedMatch >= 0) {
      const match = this.rounds[this.selectedRound].matches[this.selectedMatch];
      return `${this.getParticipant(match.p1)} vs ${this.getParticipant(match.p2)}`;
    }
    return '';
  }

  getParticipant(id: string): string {
    return this.participants[id] || "TBD";
  }

  toggleTiebreaker(index: number): void {
    const game = this.games[index];
    if (game.tiebreaker) {
      delete game.tiebreaker;
    } else {
      game.tiebreaker = { p1: 0, p2: 0 };
    }
  }

  add(): void {
    this.onAdd.emit();
  }

  remove(i: number): void {
    this.onRemove.emit(i);
  }

  save(): void {
    this.onSave.emit();
  }

  closeModal() {
    this.onClose.emit();
  }
}
