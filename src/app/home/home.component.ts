import { Component, OnInit, Type } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { TournamentService, UserService } from '../core';
import { toDateString } from '../core/utils';

@Component({
  selector: 'ng-modal-confirm',
  template: `
  <div class="modal-header">
    <h3 class="modal-title" id="modal-title">Delete Confirmation</h3>
    <button type="button" class="btn close" aria-label="Close button" aria-describedby="modal-title" (click)="modal.dismiss('Cross click')">
      <span aria-hidden="true">
        <i class="fas fa-times"></i>
      </span>
    </button>
  </div>
  <div class="modal-body">
    <p>Are you sure you want to delete?</p>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline-secondary btn-sm" (click)="modal.dismiss('cancel click')">CANCEL</button>
    <button type="button" ngbAutofocus class="btn btn-primary btn-sm" (click)="modal.close('Ok click')">OK</button>
  </div>
  `,
})
export class NgModalConfirm {
  constructor(public modal: NgbActiveModal) { }
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
    private tournamentService: TournamentService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void { }

  get tournaments() {
    return this.tournamentService.all();
  }

  toDateString(value: any) {
    return toDateString(value);
  }

  deleteTournamentConfirmation(tournament: string) {
    this.modalService.open(MODALS['deleteModal'],
      {
        ariaLabelledBy: 'modal-basic-title'
      }).result.then((result: any) => {
        this.deleteTournament(tournament);
      },
        (reason: any) => { });
  }

  deleteTournament(tournament: string) {
    this.tournamentService.delete(tournament);
  }
}
