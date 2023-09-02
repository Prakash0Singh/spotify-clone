import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuardGuard } from './auth/auth-guard.guard';

const routes: Routes = [
  {path:'log-user',component:LoginComponent},
  // {path:'home',component:HomeComponent},
  { path: '',canActivate:[AuthGuardGuard], loadChildren: () => import('./spotify-dashboard/spotify-dashboard.module').then(m => m.SpotifyDashboardModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
