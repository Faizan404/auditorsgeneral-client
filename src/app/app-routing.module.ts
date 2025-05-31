import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './MyComponents/home/home.component';
import { ProfileComponent } from './MyComponents/profile/profile.component';
import { FormHRComponent } from './MyComponents/form-hr/form-hr.component';
import { FilterHrComponent } from './MyComponents/filter-hr/filter-hr.component';
import { ErrorComponent } from './MyComponents/error/error.component';
import { ReportComponent } from './MyComponents/report/report.component';
import { AuthComponent } from './MyComponents/auth/auth.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminComponent } from './MyComponents/admin/admin.component';

const routes: Routes = [
  { path: '', component: AuthComponent },
  { path: 'account/reset-password', component: AuthComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'home/form-hr', component: FormHRComponent },
      { path: 'home/filter-hr', component: FilterHrComponent },
      { path: 'report', component: ReportComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'admin', component: AdminComponent },
    ],
  },
  { path: '**', component: ErrorComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
