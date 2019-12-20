import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { EmployeeFeedback } from '../_models/employee-feedback';
import { AuthenticationService } from '../_services/authentication-service.service';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit {
  users: User[] = [];
  currentUser: User;

  feedbackList: EmployeeFeedback[] = [];
  constructor(private userService: UserService,
    private authenticationService: AuthenticationService
    ) {
      this.currentUser = this.authenticationService.currentUserValue;

   }

  ngOnInit() {
    this.getAll();
  }
  getAll() {
    this.userService.getAllFeedback().pipe(first()).subscribe(list => {

      this.feedbackList = list;
    });
  }
  delete(empId:number) {
    this.userService.delete(empId).pipe(first()).subscribe(() => {

      this.getAll();
      alert("Feedback updated successfully")
    });
  }
  editFeedback(list:EmployeeFeedback,empId:number){
    this.userService.update(list,empId).pipe(first()).subscribe(() => {
      this.getAll();
      alert("Feedback updated successfully")
    });
  }
}
