import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Match, Participant, Round, Tournament } from 'app/models';
import { LocaleService } from 'app/models/locale.service';
import { interpolate } from "app/utils/helper.util";

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

  constructor(public locale: LocaleService) { }

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
    return `${this.locale.t.label.summary} : ${this.tournament.name}`;
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
    const localeString = this.locale.t.label.round_of;
    return key === 'r16' ? interpolate(localeString, { count: 16 }) : key === 'r8' ? interpolate(localeString, { count: 8 }) : key === 'r4' ? interpolate(localeString, { count: 4 }) : interpolate(localeString, { count: 2 });
  }

  dismissAlert(event: any): void {
    if (!event || event && this.elm.nativeElement === event.target) {
      this.close.emit(false);
    }
  }
}
