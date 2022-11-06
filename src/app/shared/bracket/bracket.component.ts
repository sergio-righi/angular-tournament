import { Component, Input, OnInit } from '@angular/core';
import { Participant } from 'src/app/core/models';

@Component({
  selector: 'app-bracket',
  templateUrl: './bracket.component.html',
  styleUrls: ['./bracket.component.scss']
})
export class BracketComponent implements OnInit {
  @Input() readonly: boolean = false;
  @Input() rounds: any = {};
  @Input() participants: any = [];

  constructor() { }

  ngOnInit(): void { }

  get keys() {
    return Object.keys(this.rounds);
  }

  get isEight() {
    return this.rounds?.r16 === undefined;
  }

  getParticipant(id: string) {
    return this.participants.find((participant: Participant) => participant.id === id) ?? {};
  }

  roundLength(round: string) {
    const quantity = Object.values(this.rounds[round]).length / 2;
    return [...Array(Math.round(quantity)).keys()];
  }

  matchupLength(round: string, i: number) {
    const value = i * 2 + 1;
    return round === 'r2' ? [value - 1] : [value - 1, value];
  }

  advance(round: string, match: number, index: number) {
    const item = this.rounds[round][match];
    if (item.x.length === 0 || item.y.length === 0) return;
    const { newMatch, newRound } = this.calculateNext(round, match);
    this.cascade(newRound, newMatch);
    if (round !== newRound) {
      this.rounds[newRound][newMatch][match % 2 === 0 ? 'x' : 'y'] =
        item[index === 0 ? 'x' : 'y'];
    }
    item.winner = index;
  }

  calculateNext(round: string, match: number): any {
    const newMatch = Math.trunc(match / 2);
    const newRound = round === 'r16' ? 'r8' : round === 'r8' ? 'r4' : 'r2';
    return { newRound, newMatch };
  }

  cascade(round: string, match: number): any {
    this.rounds[round][match].winner = -1;
    if (round === 'r2') return;
    ({ newRound: round, newMatch: match } = this.calculateNext(round, match));
    this.rounds[round][match][match % 2 === 0 ? 'x' : 'y'] = {};
    return this.cascade(round, match);
  }
}
