import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Match, Participant, Round, Tournament } from 'app/models';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  @Input() tournament!: Tournament;
  @Input() visible: boolean = false;

  @Output() close: EventEmitter<any> = new EventEmitter();

  @ViewChild('elm') elm!: ElementRef;

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(values: any) {
    if ('visible' in values && values.visible.currentValue !== values.visible.previousValue) {
      if (values.visible.currentValue) {
        document.body.classList.add('o-hidden');
      } else {
        document.body.classList.remove('o-hidden');
      }
    }
  }

  get keys(): any[] {
    return this.tournament.rounds ? Object.keys(this.tournament.rounds).map((item: string) => this.getRound(item).length > 0 ? item : null).filter(item => item) : [];
  }

  get title(): string {
    return 'Summary : ' + this.tournament.name;
  }

  get content(): string {
    return '';
  }

  getParticipant(id: string): Participant {
    return this.tournament.participants.find((participant: Participant) => participant.id === id) ?? {} as Participant;
  }

  getRound(key: string): Match[] {
    return this.tournament.rounds[key as keyof Round] ?? [];
  }

  getRoundName(key: string): string {
    return key === 'r16' ? 'Round of 16' : key === 'r8' ? 'Round of 8' : key === 'r4' ? 'Round of 4' : 'Round of 2';
  }

  dismissAlert(event: any): void {
    if (!event || event && this.elm.nativeElement === event.target) {
      this.close.emit(false);
    }
  }
}
