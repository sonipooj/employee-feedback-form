import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { EmployeeFeedback } from '../_models/employee-feedback';
import { UserService } from '../_services/user.service';
import { AuthenticationService } from '../_services/authentication-service.service';
import { User } from '../_models/user';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  feedbackList;
  currentUser: User;
  data;
  constructor(private userService: UserService,
    private authenticationService: AuthenticationService
    ) {     this.currentUser = this.authenticationService.currentUserValue;
    }

  ngOnInit() {
    this.getByFID();
  }
  getByFID(){
    this.userService.getAllFeedback().pipe(first()).subscribe(list => {

      this.feedbackList = list;
      this.feedbackList = this.feedbackList.filter(h => h.empId ===  this.currentUser.id);
    });
      
  }
  getAll() {
    this.userService.getAllFeedback().pipe(first()).subscribe(list => {

      this.feedbackList = list;

    });
  }
  
  delete(empId:number) {
    this.userService.delete(empId).pipe(first()).subscribe(() => {

      this.getByFID();
      alert("Feedback deleted successfully")
    });
  } 
  editFeedback(list:EmployeeFeedback,empId:number){
    this.userService.update(list,empId).pipe(first()).subscribe(() => {
      this.getByFID();
      alert("Feedback updated successfully");
    });
  }

}
