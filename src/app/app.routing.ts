import { Routes, RouterModule } from '@angular/router';


import { ManagerComponent } from './manager/manager.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_helpers/auth.guard';
import { Role } from './_models/role';
import { HomeComponent } from './home/home.component';
import { EmployeeComponent } from './employee/employee.component';
import { FeedbackFormComponent } from './feedback-form/feedback-form.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'admin',
        component: ManagerComponent,
        data: { roles: [Role.Admin] }
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'employee',
        component: EmployeeComponent,
        data: { roles: [Role.User] },
        children: [
            { path: '', redirectTo: 'emp-feedback', pathMatch: 'full' },
            { path: 'emp-feedback', component: FeedbackFormComponent },
            { path: 'emp-list', component: EmployeeListComponent }
          ]
    },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes);