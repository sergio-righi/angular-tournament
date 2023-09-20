import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ProfileComponent } from './profile.component';
import { ProfileAuthResolver } from './profile-auth-resolver.service';
import { SharedModule } from 'app/shared';
import { MaterialModule } from 'app/material.module';
import { ProfileRoutingModule } from './profile-routing.module';

@NgModule({
  imports: [
    MaterialModule,
    SharedModule,
    ProfileRoutingModule
  ],
  declarations: [
    ProfileComponent
  ],
  providers: [
    ProfileAuthResolver
  ]
})
export class ProfileModule { }
