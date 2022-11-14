import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { DefaultComponent } from './layout/default.component';
import { EmptyComponent } from './layout/empty.component';

const routes: Routes = [
  {
    path: 'tournament',
    component: DefaultComponent,
    loadChildren: () => import('./tournament/tournament.module').then(m => m.TournamentModule)
  },
  {
    path: 'profile',
    component: DefaultComponent,
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: 'auth',
    component: EmptyComponent,
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,
    relativeLinkResolution: 'legacy'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
