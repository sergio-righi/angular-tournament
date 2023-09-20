import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { NoAuthGuard } from './no-auth-guard.service';
import { RegisterComponent } from './register.component';

const routes: Routes = [
  {
    path: 'login',
    component: AuthComponent,
    // canActivate: [NoAuthGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    // canActivate: [NoAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
