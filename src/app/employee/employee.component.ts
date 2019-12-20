import { Component, OnInit } from '@angular/core';
import { User } from '../_models/user';
import { AuthenticationService } from '../_services/authentication-service.service';
import { UserService } from '../_services/user.service';
import { first } from 'rxjs/operators';
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  currentUser: User;
  userFromApi: User;
  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService
) {
    this.currentUser = this.authenticationService.currentUserValue;
}
ngOnInit() {
  this.userService.getById(this.currentUser.id).pipe(first()).subscribe(user => {
      this.userFromApi = user;
  });
}
}
