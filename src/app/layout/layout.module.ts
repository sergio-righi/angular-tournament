import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
  FooterComponent,
  HeaderComponent,
  SharedModule
} from 'app/shared';
import { MaterialModule } from 'app/material.module';
import { DefaultComponent } from './default.component';
import { EmptyComponent } from './empty.component';

@NgModule({
  imports: [
    MaterialModule,
    CommonModule,
    SharedModule,
    RouterModule
  ],
  declarations: [FooterComponent, HeaderComponent, DefaultComponent, EmptyComponent],
  exports: [MaterialModule, DefaultComponent, EmptyComponent]
})
export class LayoutModule { }
