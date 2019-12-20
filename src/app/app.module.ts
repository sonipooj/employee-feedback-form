import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ManagerComponent } from './manager/manager.component';
import { EmployeeComponent } from './employee/employee.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {  ErrorInterceptor } from './_helpers/error.interceptor';
import { JwtInterceptor } from './_helpers/jwt.interceptor';

import { appRoutingModule } from './app.routing';

// used to create fake backend
import { fakeBackendProvider } from './_helpers/fake-backend-interceptor.service';
import { HomeComponent } from './home/home.component';
import { FeedbackFormComponent } from './feedback-form/feedback-form.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
@NgModule({
  declarations: [
    AppComponent,
    ManagerComponent,
    EmployeeComponent,
    LoginComponent,
    HomeComponent,
    FeedbackFormComponent,
    EmployeeListComponent,
  ],
  imports: [
    BrowserModule,appRoutingModule,FormsModule,ReactiveFormsModule,HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    // provider used to create fake backend
    fakeBackendProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
