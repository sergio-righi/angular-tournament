import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { BracketComponent } from './bracket';
import { FabComponent } from './fab';
import { FeedbackComponent } from './feedback';
import { ModalComponent } from './modal';
import { NoRecordComponent, LoadingComponent } from './placeholder';
import { SwissComponent } from './swiss';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  declarations: [
    BracketComponent,
    FabComponent,
    FeedbackComponent,
    LoadingComponent,
    ModalComponent,
    NoRecordComponent,
    SwissComponent,
  ],
  exports: [
    BracketComponent,
    FabComponent,
    FeedbackComponent,
    LoadingComponent,
    ModalComponent,
    NoRecordComponent,
    SwissComponent,
    CommonModule,
    RouterModule,
  ]
})
export class SharedModule { }
