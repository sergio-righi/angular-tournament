import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultComponent } from './layout/default.component';
import { EmptyComponent } from './layout/empty.component';

const defaultLayout: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'tournament',
    loadChildren: () => import('./tournament/tournament.module').then(m => m.TournamentModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
  }
];

const emptyLayout: Routes = [
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  }
];

const routes: Routes = [
  { path: '', component: DefaultComponent, children: defaultLayout },
  { path: 'auth', component: EmptyComponent, children: emptyLayout },
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
