import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../app/pages/dashboard/dashboard.component';
import { LoginpageComponent } from '../app/pages/loginpage/loginpage.component';
import { AuthenticationGuard } from 'microsoft-adal-angular6';

const routes: Routes = [

  {path: 'login', component: LoginpageComponent},
 
  { path: 'id_token',  redirectTo: '/dashboard',  pathMatch: 'full'},
  { path: '',  redirectTo: '/login',  pathMatch: 'full'},
  {path: 'dashboard', component:  DashboardComponent,canActivate: [AuthenticationGuard]},
  {path: 'test', component: DashboardComponent},
  {path: '**', component: LoginpageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
 // imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
