import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
  FooterComponent,
  HeaderComponent,
  SharedModule
} from '../shared';
import { DefaultComponent } from './default.component';
import { EmptyComponent } from './empty.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ],
  declarations: [FooterComponent, HeaderComponent, DefaultComponent, EmptyComponent],
  exports: [DefaultComponent, EmptyComponent]
})
export class LayoutModule { }
