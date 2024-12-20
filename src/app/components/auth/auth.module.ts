import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthComponent } from './auth.component';
import { RegisterComponent } from './register.component';
import { SharedModule } from 'app/components/shared';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    AuthComponent,
    RegisterComponent,
  ],
  providers: [
  ]
})
export class AuthModule { }
