import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthComponent } from './auth.component';
import { RegisterComponent } from './register.component';
import { NoAuthGuard } from './no-auth-guard.service';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from 'app/shared';

@NgModule({
  imports: [
    SharedModule,
    AuthRoutingModule
  ],
  declarations: [
    AuthComponent,
    RegisterComponent,
  ],
  providers: [
    NoAuthGuard
  ]
})
export class AuthModule { }
