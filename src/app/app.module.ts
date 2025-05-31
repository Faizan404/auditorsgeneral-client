import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProfileComponent } from './MyComponents/profile/profile.component';
import { HeaderComponent } from './MyComponents/header/header.component';
import { FooterComponent } from './MyComponents/footer/footer.component';
import { HomeComponent } from './MyComponents/home/home.component';
import { FormHRComponent } from './MyComponents/form-hr/form-hr.component';
import { FilterHrComponent } from './MyComponents/filter-hr/filter-hr.component';
import { ErrorComponent } from './MyComponents/error/error.component';
import { ReportComponent } from './MyComponents/report/report.component';
import { AuthComponent } from './MyComponents/auth/auth.component';
import { NavComponent } from './MyComponents/nav/nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthFieldsComponent } from './Forms/auth-fields/auth-fields.component';
import { ResetformComponent } from './MyComponents/resetform/resetform.component';
import { SharedModule } from './modules/shared.module';
import { HrFieldsComponent } from './Forms/hr-fields/hr-fields.component';
import { TextareaFieldsComponent } from './Forms/textarea-fields/textarea-fields.component';
import { SelectFieldsComponent } from './Forms/select-fields/select-fields.component';
import { DatepickerFieldComponent } from './Forms/datepicker-field/datepicker-field.component';
import { FilterFieldsComponent } from './Forms/filter-fields/filter-fields.component';
import { CheckboxesComponent } from './Forms/checkboxes/checkboxes.component';
import { AdminComponent } from './MyComponents/admin/admin.component';

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    FormHRComponent,
    FilterHrComponent,
    ErrorComponent,
    ReportComponent,
    AuthComponent,
    NavComponent,
    AuthFieldsComponent,
    ResetformComponent,
    HrFieldsComponent,
    TextareaFieldsComponent,
    SelectFieldsComponent,
    DatepickerFieldComponent,
    FilterFieldsComponent,
    CheckboxesComponent,
    AdminComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,  
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
