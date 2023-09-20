import { Component, OnInit, Type } from '@angular/core';
import { Router } from '@angular/router';

import { TournamentService, UserService } from 'app/core';
import { toDateString } from 'app/core/utils';

@Component({
  selector: 'ng-modal-confirm',
  template: ``,
})
export class NgModalConfirm {
  constructor() { }
}
const MODALS: { [name: string]: Type<any> } = {
  deleteModal: NgModalConfirm,
};

@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(
    private router: Router,
    private tournamentService: TournamentService
  ) { }

  displayedColumns: string[] = ['name', 'participants', 'startDate', 'actions'];

  ngOnInit(): void { }

  get tournaments() {
    return this.tournamentService.all();
  }

  toDateString(value: any) {
    return toDateString(value);
  }

  deleteTournamentConfirmation(tournament: string) {
    // this.modalService.open(MODALS['deleteModal'],
    //   {
    //     ariaLabelledBy: 'modal-basic-title'
    //   }).result.then((result: any) => {
    //     this.deleteTournament(tournament);
    //   },
    //     (reason: any) => { });
  }

  deleteTournament(tournament: string) {
    this.tournamentService.delete(tournament);
  }
}
