import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { ProfileAuthResolver } from './profile-auth-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    resolve: {
      isAuthenticated: ProfileAuthResolver
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
